import { Edit3, Trash2 } from 'lucide-react';

function getProductImage(product) {
  return (
    product.coverImageUrl ||
    product.coverImage ||
    product.imageUrl ||
    product.image ||
    product.images?.[0] ||
    product.galleryImages?.[0] ||
    ''
  );
}

export default function ProductTable({ onDelete, onEdit, products }) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <strong>No products returned by the API</strong>
        <span>Add a product once your backend is connected.</span>
      </div>
    );
  }

  return (
    <div className="table-shell">
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id || product._id}>
              <td>
                <div className="product-thumb">
                  {getProductImage(product) ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <span>SW</span>
                  )}
                </div>
              </td>
              <td>
                <strong>{product.title}</strong>
                <span className="table-muted">ID {product.id || product._id || 'pending'}</span>
              </td>
              <td>{Number(product.price || 0).toLocaleString('en-IN', {
                currency: 'INR',
                style: 'currency',
              })}</td>
              <td>
                <span className="category-pill">{product.category}</span>
              </td>
              <td>
                <div className="table-actions">
                  <button aria-label={`Edit ${product.title}`} onClick={() => onEdit(product)} type="button">
                    <Edit3 size={16} />
                  </button>
                  <button aria-label={`Delete ${product.title}`} onClick={() => onDelete(product)} type="button">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
