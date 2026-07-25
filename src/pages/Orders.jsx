import { useEffect, useState } from 'react';
import {
  Download,
  Eye,
  FileText,
  RefreshCw,
  Tag,
  Truck,
  Waypoints,
  XCircle,
} from 'lucide-react';
import Modal from '../components/ui/Modal.jsx';
import { downloadFile } from '../services/reportsApi.js';

const STATUS_OPTIONS = ['Placed', 'Packed', 'Printed', 'Shipped', 'Delivered', 'Cancelled'];

function paymentPillClass(payment) {
  if (payment === 'Paid') return 'category-pill';
  if (payment === 'Pending') return 'category-pill category-pill--pending';
  if (payment === 'Failed') return 'category-pill category-pill--failed';
  return 'category-pill category-pill--neutral';
}

export default function Orders({ canEdit = true, isAdmin = false }) {
const token = localStorage.getItem("token");
const [exporting, setExporting] = useState(false);

async function handleExportOrders() {
  setExporting(true);
  try {
    await downloadFile('/orders/export', 'silkwaves-orders.xlsx');
  } catch (err) {
    alert(err.message);
  } finally {
    setExporting(false);
  }
}
const [orders,setOrders]=
useState([]);

const [loading,setLoading]=
useState(true);

const [
selectedOrder,
setSelectedOrder
]=useState(null);

const [
pendingStatusChange,
setPendingStatusChange
]=useState(null);

const [
sendingNotification,
setSendingNotification
]=useState(false);

useEffect(()=>{

async function load(){

try{

const res = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/orders`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
const data=
await res.json();

setOrders(data);

}

catch(err){

console.log(err);

}

finally{

setLoading(false);

}

}

load();

},[]);

async function updateStatus(
id,
status
){

try{

await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/orders/${id}/status`,
  {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },

    body: JSON.stringify({
      status
    })
  }
);

setOrders(

current=>

current.map(

o=>

o.id===id

? {
...o,
status
}

: o

)

);

}

catch(err){

console.log(err);

}

}

async function notifyStatusChange(orderId) {

  try {

    await fetch(

      `${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/notify-status`,

      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    );

  } catch (err) {

    console.log(err);

  }

}

async function confirmStatusChange(shouldNotify) {

  if (!pendingStatusChange) return;

  const { orderId, status } = pendingStatusChange;

  setSendingNotification(true);

  await updateStatus(orderId, status);

  if (shouldNotify) {
    await notifyStatusChange(orderId);
  }

  setSendingNotification(false);
  setPendingStatusChange(null);

}

async function downloadInvoice(orderId) {

  try {

    const res = await fetch(

      `${import.meta.env.VITE_API_BASE_URL}/invoices/${orderId}`,

      {

        headers: {

          Authorization: `Bearer ${token}`

        }

      }

    );

    if (!res.ok) {

      throw new Error("Unable to generate invoice");

    }

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    window.open(url, "_blank");

  }

  catch (err) {

    alert(err.message);

  }

}
async function createShipment(orderId) {

  const res = await fetch(

    `${import.meta.env.VITE_API_BASE_URL}/create-shipment/${orderId}`,

    {

      method: "POST",

      headers: {

        Authorization: `Bearer ${token}`

      }

    }

  );

  const data = await res.json();

  alert(data.message || "Shipment Created");

}

async function syncShipment(orderId) {

  const res = await fetch(

    `${import.meta.env.VITE_API_BASE_URL}/sync-shipment/${orderId}`,

    {

      method: "POST",

      headers: {

        Authorization: `Bearer ${token}`

      }

    }

  );

  const data = await res.json();

  alert(data.message || "Shipment Synced");

}

function trackShipment(orderId) {

  window.open(

    `${import.meta.env.VITE_API_BASE_URL}/track-shipment/${orderId}`,

    "_blank"

  );

}

function printLabel(orderId) {

  window.open(

    `${import.meta.env.VITE_API_BASE_URL}/shipping-label/${orderId}`,

    "_blank"

  );

}

async function cancelShipment(orderId) {

  if (!window.confirm("Cancel shipment?")) return;

  const res = await fetch(

    `${import.meta.env.VITE_API_BASE_URL}/cancel-shipment/${orderId}`,

    {

      method: "POST",

      headers: {

        Authorization: `Bearer ${token}`

      }

    }

  );

  const data = await res.json();

  alert(data.message || "Shipment Cancelled");

}
if(loading){

return (

<h2>
Loading...
</h2>
);

}

return (

<div>

<span className="eyebrow">
ORDER MANAGEMENT
</span>

<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <h1>Manage Orders</h1>
  {isAdmin && (
    <button className="button button--secondary" onClick={handleExportOrders} disabled={exporting}>
      <Download size={16} />
      {exporting ? 'Exporting...' : 'Export to Excel'}
    </button>
  )}
</div>

<div className="table-shell">

<table className="product-table">

<thead>

<tr>

<th>
Order ID
</th>

<th>
Customer
</th>

<th>
Amount
</th>

<th>
Payment
</th>

<th>
Status
</th>

<th>
Actions
</th>

</tr>

</thead>

<tbody>

{orders.map((order) => (

  <tr key={order.id}>

    <td>
      <strong>{order.id}</strong>
    </td>

    <td>{order.customer}</td>

    <td>
      ₹{Number(order.amount).toLocaleString('en-IN')}
    </td>

    <td>
      <span className={paymentPillClass(order.payment)}>{order.payment}</span>
    </td>

    <td>
      <select
        className="status-select"
        disabled={!canEdit}
        value={order.status}
        onChange={(e) =>
          setPendingStatusChange({
            orderId: order.id,
            status: e.target.value,
          })
        }
      >
        {STATUS_OPTIONS.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
    </td>

    <td>
      <div className="table-actions">
        <button title="View" onClick={() => setSelectedOrder(order)} type="button">
          <Eye size={16} />
        </button>

        <button
          title="Create Shipment"
          disabled={!canEdit}
          onClick={() => createShipment(order.id)}
          type="button"
        >
          <Truck size={16} />
        </button>

        <button title="Print Label" onClick={() => printLabel(order.id)} type="button">
          <Tag size={16} />
        </button>

        <button title="Track Shipment" onClick={() => trackShipment(order.id)} type="button">
          <Waypoints size={16} />
        </button>

        <button
          title="Sync Shipment"
          disabled={!canEdit}
          onClick={() => syncShipment(order.id)}
          type="button"
        >
          <RefreshCw size={16} />
        </button>

        <button title="Download Invoice" onClick={() => downloadInvoice(order.id)} type="button">
          <FileText size={16} />
        </button>

        <button
          title="Cancel Shipment"
          className="is-danger"
          disabled={!canEdit}
          onClick={() => cancelShipment(order.id)}
          type="button"
        >
          <XCircle size={16} />
        </button>
      </div>
    </td>

  </tr>

))}

</tbody>

</table>

</div>

<Modal
  isOpen={!!selectedOrder}
  onClose={() => setSelectedOrder(null)}
  title={selectedOrder ? `Order ${selectedOrder.id}` : ''}
>
  {selectedOrder && (
    <div className="order-detail">
      <dl>
        <dt>Customer</dt>
        <dd>{selectedOrder.customer}</dd>

        <dt>Amount</dt>
        <dd>₹{Number(selectedOrder.amount).toLocaleString('en-IN')}</dd>

        <dt>Payment</dt>
        <dd>
          <span className={paymentPillClass(selectedOrder.payment)}>{selectedOrder.payment}</span>
        </dd>

        <dt>Status</dt>
        <dd>{selectedOrder.status}</dd>
      </dl>
    </div>
  )}
</Modal>

<Modal
  isOpen={!!pendingStatusChange}
  onClose={() => !sendingNotification && setPendingStatusChange(null)}
  title={pendingStatusChange ? `Status changed to ${pendingStatusChange.status}` : ''}
>
  <div className="status-confirm">
    <p>Send a status update email to the customer for this change?</p>

    <div className="form-actions">
      <button
        className="button button--primary"
        disabled={sendingNotification}
        onClick={() => confirmStatusChange(true)}
        type="button"
      >
        {sendingNotification ? 'Working...' : 'Yes, send email'}
      </button>

      <button
        className="button button--secondary"
        disabled={sendingNotification}
        onClick={() => confirmStatusChange(false)}
        type="button"
      >
        No, just update
      </button>
    </div>
  </div>
</Modal>

</div>

);

}
