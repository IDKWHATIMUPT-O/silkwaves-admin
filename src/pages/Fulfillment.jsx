import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function Fulfillment() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/orders`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  const waitingForPrint =
    orders.filter(o => o.status === "Paid").length;

  const packing =
    orders.filter(o => o.status === "Packing").length;

  const ready =
    orders.filter(o => o.status === "Ready").length;

  const shipped =
    orders.filter(o => o.status === "Shipped").length;

  return (

    <div>

      <span className="eyebrow">
        FULFILLMENT CENTER
      </span>

      <h1>
        Warehouse
      </h1>

      <div className="dashboard-grid">

        <div className="stat-card">
          <h2>{waitingForPrint}</h2>
          <p>Waiting for Print</p>
        </div>

        <div className="stat-card">
          <h2>{packing}</h2>
          <p>Packing</p>
        </div>

        <div className="stat-card">
          <h2>{ready}</h2>
          <p>Ready to Ship</p>
        </div>

        <div className="stat-card">
          <h2>{shipped}</h2>
          <p>Shipped</p>
        </div>

      </div>

      <div className="table-shell">

        <table className="product-table">

          <thead>

            <tr>

              <th>Order</th>

              <th>Customer</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {orders.map(order => (

              <tr key={order.id}>

                <td>{order.id}</td>

                <td>{order.customer}</td>

                <td>{order.status}</td>

                <td>

                  <button>

                    Open

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}