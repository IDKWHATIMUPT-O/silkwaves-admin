import { useEffect, useRef, useState } from 'react';
import { Eye, Upload } from 'lucide-react';

function paymentPillClass(payment) {
  if (payment === 'Paid') return 'category-pill';
  if (payment === 'Pending') return 'category-pill category-pill--pending';
  if (payment === 'Failed') return 'category-pill category-pill--failed';
  return 'category-pill category-pill--neutral';
}

export default function Vouchers({ canEdit = true }) {
  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingId, setUploadingId] = useState(null);
  const fileInputs = useRef({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to load orders');
        }

        const data = await res.json();
        const paidOrders = data
          .filter((order) => order.payment === 'Paid')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(paidOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleFileSelected(orderId, file) {
    if (!file) return;

    setUploadingId(orderId);
    setError('');

    try {
      const formData = new FormData();
      formData.append('voucherFile', file);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/invoice`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }

      const updated = await res.json();

      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, invoiceFileUrl: updated.invoiceFileUrl } : order))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingId(null);
    }
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <span className="eyebrow">TALLY VOUCHERS</span>
      <h1>Vouchers</h1>

      {error && <div className="system-alert">{error}</div>}

      <div className="table-shell">
        <table className="product-table">
          <thead>
            <tr>
              <th>Reference No.</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Tally Voucher No.</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>{order.id}</strong>
                </td>
                <td>{order.customer}</td>
                <td>₹{Number(order.amount).toLocaleString('en-IN')}</td>
                <td>
                  <span className={paymentPillClass(order.payment)}>{order.payment}</span>
                </td>
                <td>{order.tallyVoucherNumber || '—'}</td>
                <td>
                  <div className="table-actions">
                    {order.invoiceFileUrl && (
                      <button
                        title="View Invoice"
                        onClick={() => window.open(order.invoiceFileUrl, '_blank')}
                        type="button"
                      >
                        <Eye size={16} />
                      </button>
                    )}

                    <input
                      accept="application/pdf"
                      onChange={(e) => handleFileSelected(order.id, e.target.files?.[0])}
                      ref={(el) => {
                        fileInputs.current[order.id] = el;
                      }}
                      style={{ display: 'none' }}
                      type="file"
                    />

                    <button
                      disabled={!canEdit || uploadingId === order.id}
                      onClick={() => fileInputs.current[order.id]?.click()}
                      title={order.invoiceFileUrl ? 'Replace Invoice' : 'Upload Invoice'}
                      type="button"
                    >
                      <Upload size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="empty-state">
            <strong>No paid orders yet</strong>
            <span>Reference numbers will appear here once an order's payment is confirmed.</span>
          </div>
        )}
      </div>
    </div>
  );
}
