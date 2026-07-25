import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import Modal from '../components/ui/Modal.jsx';
import { getCustomers, getCustomer } from '../services/customersApi.js';
import { downloadFile } from '../services/reportsApi.js';

export default function Customers({ isAdmin = false }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      await downloadFile('/admin/customers/export', 'silkwaves-customers.xlsx');
    } catch (err) {
      alert(err.message);
    } finally {
      setExporting(false);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function openCustomer(id) {
    setDetailLoading(true);

    try {
      const data = await getCustomer(id);
      setSelectedCustomer(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setDetailLoading(false);
    }
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <span className="eyebrow">CUSTOMER MANAGEMENT</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>Customers</h1>
        {isAdmin && (
          <button className="button button--secondary" onClick={handleExport} disabled={exporting}>
            <Download size={16} />
            {exporting ? 'Exporting...' : 'Export to Excel'}
          </button>
        )}
      </div>

      <div className="table-shell">
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Addresses</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Joined</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => openCustomer(customer.id)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <strong>{customer.name || 'Unnamed'}</strong>
                </td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.addressCount}</td>
                <td>{customer.orderCount}</td>
                <td>₹{Number(customer.totalSpent).toLocaleString('en-IN')}</td>
                <td>{new Date(customer.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedCustomer || detailLoading}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer ? selectedCustomer.name || selectedCustomer.phone : 'Loading...'}
      >
        {detailLoading && <p>Loading customer...</p>}

        {selectedCustomer && !detailLoading && (
          <div>
            <p>
              <b>Phone:</b> {selectedCustomer.phone}
            </p>
            <p>
              <b>Email:</b> {selectedCustomer.email}
            </p>
            <p>
              <b>Verified:</b> {selectedCustomer.verified ? 'Yes' : 'No'}
            </p>
            <p>
              <b>Joined:</b> {new Date(selectedCustomer.createdAt).toLocaleDateString('en-IN')}
            </p>

            <h3>Saved Addresses</h3>
            {selectedCustomer.addresses.length === 0 ? (
              <p>No saved addresses.</p>
            ) : (
              selectedCustomer.addresses.map((addr) => (
                <div
                  key={addr._id}
                  style={{
                    border: '1px solid #e5e5e5',
                    borderRadius: '10px',
                    padding: '12px',
                    marginBottom: '10px',
                  }}
                >
                  <strong>{addr.label}</strong> {addr.isDefault && '(Default)'}
                  <p style={{ margin: '4px 0 0' }}>
                    {addr.name}, {addr.phone}
                    <br />
                    {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
              ))
            )}

            <h3>Order History ({selectedCustomer.orders.length})</h3>
            <div className="table-shell">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCustomer.orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.id}</strong>
                      </td>
                      <td>₹{Number(order.amount).toLocaleString('en-IN')}</td>
                      <td>
                        <span className="category-pill">{order.payment}</span>
                      </td>
                      <td>{order.status}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
