import { BarChart3, Boxes, Clock3, FolderKanban } from 'lucide-react';
import DashboardCard from '../components/dashboard/DashboardCard.jsx';
import { PRODUCT_CATEGORIES } from '../constants/categories.js';

function getRecentProducts(products) {
  return [...products]
    .sort((first, second) => {
      const firstDate = new Date(first.createdAt || first.updatedAt || 0).getTime();
      const secondDate = new Date(second.createdAt || second.updatedAt || 0).getTime();
      return secondDate - firstDate;
    })
    .slice(0, 4);
}

export default function Dashboard({ error, isLoading, products }) {
  const recentProducts = getRecentProducts(products);

  return (
    <section className="page-stack">
      {error && <div className="system-alert">{error}</div>}

      <div className="metrics-grid">
        <DashboardCard icon={Boxes} label="Total Products" value={isLoading ? '...' : products.length} />
        <DashboardCard icon={FolderKanban} label="Categories Count" tone="beige" value={PRODUCT_CATEGORIES.length} />
        <DashboardCard icon={Clock3} label="Recent Uploads" value={isLoading ? '...' : recentProducts.length} />
      </div>

      <div className="dashboard-grid">
        <section className="panel panel--large">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">Catalog Activity</p>
              <h2>Analytics Overview</h2>
            </div>
            <BarChart3 size={22} />
          </div>
          <div className="analytics-placeholder">
            <div className="analytics-placeholder__axis" />
            <div className="bar" style={{ height: '44%' }} />
            <div className="bar" style={{ height: '66%' }} />
            <div className="bar" style={{ height: '52%' }} />
            <div className="bar" style={{ height: '78%' }} />
            <div className="bar" style={{ height: '58%' }} />
            <div className="bar" style={{ height: '70%' }} />
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">Latest</p>
              <h2>Recent Uploads</h2>
            </div>
          </div>
          <div className="recent-list">
            {recentProducts.length ? (
              recentProducts.map((product) => (
                <article key={product.id || product._id} className="recent-item">
                  <span>{product.title?.slice(0, 2).toUpperCase() || 'SW'}</span>
                  <div>
                    <strong>{product.title}</strong>
                    <p>{product.category}</p>
                  </div>
                </article>
              ))
            ) : (
              <p className="panel-empty">Products from the backend will appear here.</p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
