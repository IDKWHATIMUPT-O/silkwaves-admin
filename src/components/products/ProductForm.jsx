import { useEffect, useState } from 'react';
import { ImagePlus, Images, Save } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../../constants/categories.js';
import Button from '../ui/Button.jsx';

const EMPTY_PRODUCT = {
title:'',
price:'',
stock:'',

category:
PRODUCT_CATEGORIES[0],

description:'',

coverImage:null,

galleryImages:[]
};
function normalizeProduct(product) {
  return {
    title: product?.title || '',
    price: product?.price ?? '',
    stock: product?.stock ?? '',
    category: product?.category || PRODUCT_CATEGORIES[0],
    description: product?.description || '',
    coverImage: null,
    galleryImages: [],
  };
}

function getExistingCoverLabel(product) {
  return product?.coverImageUrl || product?.coverImage || product?.imageUrl || product?.image || '';
}

function getExistingGalleryCount(product) {
  if (Array.isArray(product?.galleryImages)) {
    return product.galleryImages.length;
  }

  if (Array.isArray(product?.images)) {
    return product.images.length;
  }

  return 0;
}

export default function ProductForm({
  initialProduct = EMPTY_PRODUCT,
  onCancel,
  onSubmit,
  submitLabel = 'Save Product',
}) {
  const [formData, setFormData] = useState(normalizeProduct(initialProduct));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const isEditing = Boolean(initialProduct?.id || initialProduct?._id);
  const existingCoverLabel = getExistingCoverLabel(initialProduct);
  const existingGalleryCount = getExistingGalleryCount(initialProduct);

  useEffect(() => {
    setFormData(normalizeProduct(initialProduct));
  }, [initialProduct]);

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
  event.preventDefault();

  setFormError('');

  if (!formData.title.trim()) {
    setFormError('Title is required');
    return;
  }

  if (!formData.price) {
    setFormError('Price is required');
    return;
  }

  if(
!isEditing
&&
!formData.coverImage
){

setFormError(
'Cover image required'
);

return;

}

  setIsSubmitting(true);

  try {
    const submitData = new FormData();

    submitData.append('title', formData.title);
    submitData.append('price', formData.price);
    submitData.append("stock",formData.stock);
    submitData.append('category', formData.category);
    submitData.append('description', formData.description);

    if (formData.coverImage) {
      submitData.append(
        'coverImage',
        formData.coverImage
      );
    }

    formData.galleryImages.forEach((file) => {
      submitData.append(
        'galleryImages',
        file
      );
    });

    const endpoint =
isEditing
? `${import.meta.env.VITE_API_BASE_URL}/products/${initialProduct.id || initialProduct._id}`
: `${import.meta.env.VITE_API_BASE_URL}/products`;

const method =
isEditing
? "PUT"
: "POST";

const token = localStorage.getItem("token");

const res = await fetch(
  endpoint,
  {
    method,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: submitData
  }
);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error || 'Upload failed'
      );
    }

    // ← CHANGED HERE
    onSubmit?.(data);

    // ← ADDED THIS
    setFormData(EMPTY_PRODUCT);

  } catch (err) {
    setFormError(
      err.message || 'Failed to save product'
    );
  } finally {
    setIsSubmitting(false);
  }
}
  return (
    <form className="product-form" onSubmit={handleSubmit}>
      {formError && <div className="form-alert">{formError}</div>}

      <div className="form-grid">
        <label className="field field--wide">
          <span>Product Title</span>
          <input
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Kanchipuram silk saree"
            type="text"
            value={formData.title}
          />
        </label>

        <label className="field">
          <span>Price</span>
          <input
            min="0"
            onChange={(event) => updateField('price', event.target.value)}
            placeholder="12999"
            step="0.01"
            type="number"
            value={formData.price}
          />
        </label>
        <label className="field">

  <span>Stock</span>

  <input
    min="0"

    onChange={(event)=>
      updateField(
        'stock',
        event.target.value
      )
    }

    placeholder="50"

    type="number"

    value={formData.stock}
  />

</label>

        <label className="field">
          <span>Category</span>
          <select
            onChange={(event) => updateField('category', event.target.value)}
            value={formData.category}
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="field field--wide">
          <span>Description</span>
          <textarea
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Fabric, weave, occasion, and care details"
            rows="5"
            value={formData.description}
          />
        </label>

        <label className="field field--wide">
          <span>Main Cover Image</span>
          <div className="file-upload">
            <ImagePlus size={18} />
            <div>
              <strong>{formData.coverImage?.name || 'Upload cover image'}</strong>
              <small>
                {existingCoverLabel && !formData.coverImage
                  ? 'Current cover image will stay unless replaced.'
                  : 'Used as the product listing and primary gallery image.'}
              </small>
            </div>
            <input
              accept="image/*"
              onChange={(event) => updateField('coverImage', event.target.files?.[0] || null)}
              type="file"
            />
          </div>
        </label>

        <label className="field field--wide">
          <span>Product Gallery Images</span>
          <div className="file-upload">
            <Images size={18} />
            <div>
              <strong>
                {formData.galleryImages.length
                  ? `${formData.galleryImages.length} image${formData.galleryImages.length > 1 ? 's' : ''} selected`
                  : 'Upload up to 4 gallery images'}
              </strong>
              <small>
                {existingGalleryCount && !formData.galleryImages.length
                  ? `${existingGalleryCount} existing gallery image${existingGalleryCount > 1 ? 's' : ''} will stay unless replaced.`
                  : 'Select the supporting product gallery images together.'}
              </small>
            </div>
            <input
              accept="image/*"
              multiple
              onChange={(event) => {
                const files = Array.from(event.target.files || []).slice(0, 4);
                updateField('galleryImages', files);
              }}
              type="file"
            />
          </div>

          {formData.galleryImages.length > 0 && (
            <div className="selected-files">
              {formData.galleryImages.map((file) => (
                <span key={`${file.name}-${file.lastModified}`}>{file.name}</span>
              ))}
            </div>
          )}
        </label>
      </div>

      <div className="form-actions">
        {onCancel && (
          <Button onClick={onCancel} type="button" variant="secondary">
            Cancel
          </Button>
        )}
        <Button disabled={isSubmitting} type="submit">
          <Save size={17} />
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}