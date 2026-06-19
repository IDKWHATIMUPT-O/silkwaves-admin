import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import ProductForm from '../components/products/ProductForm.jsx';
import Button from '../components/ui/Button.jsx';
import { createProduct } from '../services/productsApi.js';

export default function AddProduct({ onCreated, onNavigate }) {
  const [successMessage, setSuccessMessage] = useState('');

  async function handleCreate(product) {
    await createProduct(product);
    setSuccessMessage('Product published to the backend API.');
    await onCreated();
  }

  return (
    <section className="page-stack">
      {successMessage && (
        <div className="success-alert">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
          <Button onClick={() => onNavigate('manage-products')} variant="ghost">
            View Products
          </Button>
        </div>
      )}

      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="panel__eyebrow">CMS Core Feature</p>
            <h2>Add Saree Product</h2>
          </div>
        </div>
        <ProductForm onSubmit={handleCreate} submitLabel="Submit Product" />
      </section>
    </section>
  );
}
