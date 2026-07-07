import { useEffect, useState } from 'react';

export default function Orders() {
const token = localStorage.getItem("token");
const [orders,setOrders]=
useState([]);

const [loading,setLoading]=
useState(true);

const [
selectedOrder,
setSelectedOrder
]=useState(null);

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

<h1>
Manage Orders
</h1>

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

{

orders.map(
(order)=>(

<tr
key={order.id}
>

<td>

<strong>
{order.id}
</strong>

</td>

<td>

{order.customer}

</td>

<td>

₹{
Number(
order.amount
).toLocaleString(
'en-IN'
)
}

</td>

<td>

<span
className="category-pill"

>

{
order.payment
}

</span>

</td>

<td>

<select

value={
order.status
}

onChange={
(e)=>

updateStatus(
order.id,
e.target.value
)

}

>

<option>
Placed
</option>

<option>
Packed
</option>

<option>
Printed
</option>

<option>
Shipped
</option>

<option>
Delivered
</option>

<option>
Cancelled
</option>

</select>

</td>

<td>

<div
className="table-actions"
>

<button
onClick={()=>
setSelectedOrder(
order
)
}

>

View

</button>

<button onClick={() => createShipment(order.id)}>

Shipment

</button>

<button onClick={() => printLabel(order.id)}>

Label

</button>

<button onClick={() => trackShipment(order.id)}>

Track

</button>

<button onClick={() => syncShipment(order.id)}>

Sync

</button>
<button
  onClick={() => downloadInvoice(order.id)}
>

Invoice

</button>

<button onClick={() => cancelShipment(order.id)}>

Cancel

</button>


</div>

</td>

</tr>

)

)

}

</tbody>

</table>

</div>

{

selectedOrder && (

<div
style={{

position:'fixed',

inset:0,

background:
'rgba(0,0,0,.4)',

display:'flex',

alignItems:
'center',

justifyContent:
'center'

}}

>

<div
style={{

background:
'white',

padding:
'24px',

borderRadius:
'20px',

width:
'500px'

}}

>

<h2>
Order Details
</h2>

<p>
ID:
{
selectedOrder.id
}
</p>

<p>
Customer:
{
selectedOrder.customer
}
</p>

<p>
Amount:
₹{
selectedOrder.amount
}
</p>

<p>
Payment:
{
selectedOrder.payment
}
</p>

<p>
Status:
{
selectedOrder.status
}
</p>

<button
onClick={()=>
setSelectedOrder(
null
)
}

>

Close

</button>

</div>

</div>

)

}

</div>

);

}
