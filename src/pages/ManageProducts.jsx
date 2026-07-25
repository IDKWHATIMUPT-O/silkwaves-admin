import { useState } from 'react';
import { Download } from 'lucide-react';
import ProductForm from '../components/products/ProductForm.jsx';
import ProductTable from '../components/products/ProductTable.jsx';
import Modal from '../components/ui/Modal.jsx';
import { deleteProduct, updateProduct } from '../services/productsApi.js';
import { downloadFile } from '../services/reportsApi.js';

function getProductId(product) {
  return product.id || product._id;
}

export default function ManageProducts({ error, isLoading, onProductsChanged, products, canEdit = true, isAdmin = false }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [actionError, setActionError] = useState('');
  const [isDeletingId, setIsDeletingId] = useState('');
  const [exporting, setExporting] = useState(false);

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

  async function handleExport() {
    setExporting(true);
    try {
      await downloadFile('/products/export', 'silkwaves-products.xlsx');
    } catch (err) {
      alert(err.message);
    } finally {
      setExporting(false);
    }
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="record-count">{isLoading ? 'Loading' : `${products.length} records`}</span>
            {isAdmin && (
              <button className="button button--secondary" onClick={handleExport} disabled={exporting}>
                <Download size={16} />
                {exporting ? 'Exporting...' : 'Export to Excel'}
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state">Loading products from API...</div>
        ) : (
          <ProductTable onDelete={handleDelete} onEdit={setEditingProduct} products={products} canEdit={canEdit} />
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
