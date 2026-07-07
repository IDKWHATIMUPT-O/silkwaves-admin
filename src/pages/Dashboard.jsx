
import { BarChart3, Boxes, Clock3, FolderKanban, IndianRupee, ShoppingCart, Users, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import DashboardCard from "../components/dashboard/DashboardCard.jsx";

export default function Dashboard({ error, isLoading, products, dashboardData }) {
  const recentProducts = dashboardData?.recentProducts || [];
  const recentOrders = dashboardData?.recentOrders || [];
  const topProducts = dashboardData?.topProducts || [];
  const lowStockProducts = dashboardData?.lowStockProducts || [];
  const chart = dashboardData?.revenueLast30Days || [];

  return (
    <section className="page-stack">
      {error && <div className="system-alert">{error}</div>}

      <div className="metrics-grid">
        <DashboardCard icon={IndianRupee} label="Revenue" value={dashboardData ? `₹${dashboardData.revenue.toLocaleString("en-IN")}` : "..."} />
        <DashboardCard icon={ShoppingCart} label="Orders" value={dashboardData?.totalOrders ?? "..."} />
        <DashboardCard icon={Users} label="Customers" value={dashboardData?.customers ?? "..."} />
        <DashboardCard icon={Boxes} label="Products" value={dashboardData?.totalProducts ?? products.length} />
        <DashboardCard icon={Clock3} label="Pending" value={dashboardData?.pendingOrders ?? "..."} />
        <DashboardCard icon={FolderKanban} label="Shipped" value={dashboardData?.shipped ?? "..."} />
        <DashboardCard icon={BarChart3} label="Delivered" value={dashboardData?.delivered ?? "..."} />
        <DashboardCard icon={AlertTriangle} label="Low Stock" value={dashboardData?.lowStock ?? "..."} />
      </div>

      <div className="dashboard-grid">
        <section className="panel panel--large">
          <div className="panel__header"><div><p className="panel__eyebrow">Sales</p><h2>Revenue (Last 30 Days)</h2></div></div>
          <div style={{height:320}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="day"/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="amount"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <div className="panel__header"><h2>Top Selling Products</h2></div>
          {topProducts.length ? topProducts.map(item => (
            <article key={item.title} className="recent-item">
              <span>{item.quantity}</span>
              <div><strong>{item.title}</strong><p>₹{item.revenue.toLocaleString("en-IN")}</p></div>
            </article>
          )) : <p className="panel-empty">No sales yet.</p>}
        </section>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel__header"><h2>Recent Orders</h2></div>
          {recentOrders.length ? recentOrders.map(order => (
            <article key={order.id} className="recent-item">
              <span>{order.customer?.slice(0,2).toUpperCase()}</span>
              <div><strong>{order.id}</strong><p>₹{Number(order.amount).toLocaleString("en-IN")}</p></div>
            </article>
          )) : <p className="panel-empty">No orders found.</p>}
        </section>

        <section className="panel">
          <div className="panel__header"><h2>Recent Products</h2></div>
          {recentProducts.length ? recentProducts.map(product => (
            <article key={product._id} className="recent-item">
              <span>{product.title?.slice(0,2).toUpperCase()}</span>
              <div><strong>{product.title}</strong><p>Stock: {product.stock}</p></div>
            </article>
          )) : <p className="panel-empty">No products found.</p>}
        </section>

        <section className="panel">
          <div className="panel__header"><h2>Inventory Alerts</h2></div>
          {lowStockProducts.length ? lowStockProducts.map(product => (
            <article key={product._id} className="recent-item">
              <span>⚠</span>
              <div><strong>{product.title}</strong><p>Only {product.stock} left</p></div>
            </article>
          )) : <p className="panel-empty">Inventory healthy.</p>}
        </section>
      </div>
    </section>
  );
}
