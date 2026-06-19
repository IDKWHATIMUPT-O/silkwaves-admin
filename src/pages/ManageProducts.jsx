import { useState } from 'react';
import ProductForm from '../components/products/ProductForm.jsx';
import ProductTable from '../components/products/ProductTable.jsx';
import Modal from '../components/ui/Modal.jsx';
import { deleteProduct, updateProduct } from '../services/productsApi.js';

function getProductId(product) {
  return product.id || product._id;
}

export default function ManageProducts({ error, isLoading, onProductsChanged, products }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [actionError, setActionError] = useState('');
  const [isDeletingId, setIsDeletingId] = useState('');

  async function handleDelete(product) {
    const productId = getProductId(product);

    if (!productId) {
      setActionError('Cannot delete a product without an API id.');
      return;
    }

    const confirmed = window.confirm(`Delete "${product.title}" from SILKWAVES products?`);

    if (!confirmed) {
      return;
    }

    setActionError('');
    setIsDeletingId(productId);

    try {
      await deleteProduct(productId);
      await onProductsChanged();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setIsDeletingId('');
    }
  }

  async function handleUpdate(product) {
    const productId = getProductId(editingProduct);

    if (!productId) {
      throw new Error('Cannot update a product without an API id.');
    }

    await updateProduct(productId, product);
    setEditingProduct(null);
    await onProductsChanged();
  }

  return (
    <section className="page-stack">
      {(error || actionError) && <div className="system-alert">{actionError || error}</div>}
      {isDeletingId && <div className="notice-alert">Deleting product...</div>}

      <section className="panel">
        <div className="panel__header panel__header--table">
          <div>
            <p className="panel__eyebrow">Catalog Records</p>
            <h2>Manage Products</h2>
          </div>
          <span className="record-count">{isLoading ? 'Loading' : `${products.length} records`}</span>
        </div>

        {isLoading ? (
          <div className="loading-state">Loading products from API...</div>
        ) : (
          <ProductTable onDelete={handleDelete} onEdit={setEditingProduct} products={products} />
        )}
      </section>

      <Modal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        title="Edit Product"
      >
        <ProductForm
          initialProduct={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
        />
      </Modal>
    </section>
  );
}
