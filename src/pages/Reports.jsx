import { useEffect, useState } from 'react';
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Boxes,
  AlertTriangle,
  Truck,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import DashboardCard from '../components/dashboard/DashboardCard.jsx';
import { getReports, downloadFile } from '../services/reportsApi.js';

export default function Reports({ isAdmin = false }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  async function load() {
    setLoading(true);
    setError('');

    try {
      const result = await getReports({ from, to });
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleExport() {
    setExporting(true);

    try {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      const query = params.toString() ? `?${params.toString()}` : '';

      await downloadFile(`/reports/export${query}`, 'silkwaves-report.xlsx');
    } catch (err) {
      alert(err.message);
    } finally {
      setExporting(false);
    }
  }

  const statusChartData = data
    ? Object.entries(data.orders.byStatus).map(([status, count]) => ({ status, count }))
    : [];

  return (
    <section className="page-stack">
      <span className="eyebrow">BUSINESS INSIGHTS</span>
      <h1>Reports</h1>

      {error && <div className="system-alert">{error}</div>}

      <div className="panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'end', flexWrap: 'wrap' }}>
        <label className="field">
          <span>From</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="field">
          <span>To</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <button className="button button--secondary" onClick={load} disabled={loading}>
          {loading ? 'Loading...' : 'Apply'}
        </button>

        {isAdmin && (
          <button
            className="button button--primary"
            onClick={handleExport}
            disabled={exporting || !data}
            style={{ marginLeft: 'auto' }}
          >
            <Download size={16} />
            {exporting ? 'Exporting...' : 'Export Full Report'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-state">Loading reports...</div>
      ) : data ? (
        <>
          <div className="metrics-grid">
            <DashboardCard icon={IndianRupee} label="Revenue" value={`₹${data.revenue.total.toLocaleString('en-IN')}`} />
            <DashboardCard icon={ShoppingCart} label="Orders" value={data.orders.total} />
            <DashboardCard icon={Users} label="Customers" value={data.customers.total} />
            <DashboardCard icon={Boxes} label="Products" value={data.products.total} />
            <DashboardCard icon={AlertTriangle} label="Low Stock" value={data.stock.lowStockCount} />
            <DashboardCard icon={Truck} label="Shipments Created" value={data.shipment.awbGeneratedCount} />
          </div>

          <div className="dashboard-grid">
            <section className="panel panel--large">
              <div className="panel__header">
                <div>
                  <p className="panel__eyebrow">Sales</p>
                  <h2>Revenue Trend</h2>
                </div>
              </div>
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.revenue.trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#00674e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel">
              <div className="panel__header">
                <h2>Orders by Status</h2>
              </div>
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00674e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <div className="dashboard-grid">
            <section className="panel">
              <div className="panel__header">
                <h2>Top Customers</h2>
              </div>
              {data.customers.topSpenders.length ? (
                data.customers.topSpenders.map((c) => (
                  <article key={c.phone} className="recent-item">
                    <span>{c.name?.slice(0, 2).toUpperCase() || '??'}</span>
                    <div>
                      <strong>{c.name || c.phone}</strong>
                      <p>₹{c.totalSpent.toLocaleString('en-IN')} · {c.orderCount} orders</p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="panel-empty">No customer spend data yet.</p>
              )}
            </section>

            <section className="panel">
              <div className="panel__header">
                <h2>Low Stock</h2>
              </div>
              {data.stock.lowStockProducts.length ? (
                data.stock.lowStockProducts.map((p) => (
                  <article key={p.title} className="recent-item">
                    <span>⚠</span>
                    <div>
                      <strong>{p.title}</strong>
                      <p>Only {p.stock} left</p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="panel-empty">Inventory healthy.</p>
              )}
            </section>

            <section className="panel">
              <div className="panel__header">
                <h2>Shipment Status</h2>
              </div>
              {Object.entries(data.shipment.byStatus).length ? (
                Object.entries(data.shipment.byStatus).map(([status, count]) => (
                  <article key={status} className="recent-item">
                    <span>{count}</span>
                    <div>
                      <strong>{status}</strong>
                      <p>{count} order{count === 1 ? '' : 's'}</p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="panel-empty">No shipment data yet.</p>
              )}
            </section>
          </div>
        </>
      ) : null}
    </section>
  );
}
