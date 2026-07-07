import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("token");

export default function Fulfillment() {

  const [orders, setOrders] = useState([]);
const [selectedOrder, setSelectedOrder] = useState(null);
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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
    async function createShipment(orderId){

  try{

    const res = await fetch(

      `${API}/create-shipment/${orderId}`,

      {

        method:"POST",

        headers:{

          Authorization:`Bearer ${token}`

        }

      }

    );

    const data = await res.json();

console.log(data);

alert(JSON.stringify(data, null, 2));

  }

  catch(err){

    console.log(err);

  }

}
async function downloadInvoice(orderId) {

  try {

    const res = await fetch(

      `${API}/invoices/${orderId}`,

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

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");

  }

  catch(err){

    alert(err.message);

  }

}
function printLabel(orderId){

  window.open(

    `${API}/shipping-label/${orderId}`,

    "_blank"

  );

}
function trackShipment(orderId){

  window.open(

    `${API}/track-shipment/${orderId}`,

    "_blank"

  );

}
async function syncShipment(orderId){

  const res = await fetch(

    `${API}/sync-shipment/${orderId}`,

    {

      method:"POST",

      headers:{

        Authorization:`Bearer ${token}`

      }

    }

  );

  const data = await res.json();

  alert(data.message);

}
async function cancelShipment(orderId){

  if(!window.confirm("Cancel Shipment?"))

    return;

  const res = await fetch(

    `${API}/cancel-shipment/${orderId}`,

    {

      method:"POST",

      headers:{

        Authorization:`Bearer ${token}`

      }

    }

  );

  const data = await res.json();

  alert(data.message);

}
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

                 <button
  onClick={() => setSelectedOrder(order)}
>

  Open

</button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
{selectedOrder && (

<div
style={{

position:"fixed",

inset:0,

background:"rgba(0,0,0,.5)",

display:"flex",

justifyContent:"center",

alignItems:"center",

zIndex:1000

}}
>

<div
style={{

background:"#fff",

width:"900px",

maxHeight:"90vh",

overflowY:"auto",

borderRadius:"20px",

padding:"30px"

}}
>

<h2>

Order {selectedOrder.id}

</h2>

<hr/>

<h3>

Customer

</h3>

<p><strong>Name:</strong> {selectedOrder.customer}</p>

<p><strong>Phone:</strong> {selectedOrder.phone}</p>

<p><strong>Payment:</strong> {selectedOrder.payment}</p>

<p><strong>Status:</strong> {selectedOrder.status}</p>

<hr/>

<h3>

Shipping Address

</h3>

<p>{selectedOrder.address}</p>

<p>

{selectedOrder.city},

{" "}

{selectedOrder.state}

-

{selectedOrder.pincode}

</p>

<hr/>

<h3>

Products

</h3>

{

selectedOrder.items?.map(item=>(

<div

key={item.productId}

style={{

display:"flex",

justifyContent:"space-between",

padding:"10px 0",

borderBottom:"1px solid #eee"

}}

>

<div>

<strong>{item.title}</strong>

<br/>

Qty: {item.quantity}

</div>

<div>

₹{item.price}

</div>

</div>

))

}

<hr/>

<h3>

Shipment

</h3>

<p>

Courier:

{" "}

{selectedOrder.courier}

</p>

<p>

AWB:

{" "}

{selectedOrder.awb || "Not Generated"}

</p>

<p>

Shipment Status:

{" "}

{selectedOrder.shipmentStatus}

</p>

<div
style={{

display:"flex",

gap:"10px",

marginTop:"25px",

flexWrap:"wrap"

}}
>

<button
onClick={()=>
downloadInvoice(selectedOrder.id)
}
>

Invoice

</button>

<button
onClick={()=>
createShipment(selectedOrder.id)
}
>

Create Shipment

</button>

<button
onClick={()=>
printLabel(selectedOrder.id)
}
>

Print Label

</button>

<button
onClick={()=>
trackShipment(selectedOrder.id)
}
>

Track

</button>

<button
onClick={()=>
syncShipment(selectedOrder.id)
}
>

Sync

</button>

<button
onClick={()=>
cancelShipment(selectedOrder.id)
}
>

Cancel Shipment

</button>

</div>

</div>

</div>

)}
    </div>

  );

}