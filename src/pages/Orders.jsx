import { useEffect, useState } from 'react';

export default function Orders() {

const [orders,setOrders]=
useState([]);

const [loading,setLoading]=
useState(true);

useEffect(()=>{

async function load(){

try{

const res=
await fetch(
`${import.meta.env.VITE_API_BASE_URL}/orders`
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

function updateStatus(
id,
status
){

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

if(loading){

return <h2>Loading…</h2>;

}

return(

<div>

<span className="eyebrow">
ORDERS
</span>

<h1>
Orders
</h1>

<div
className="table-shell"
>

<table
className="product-table"
>

<thead>

<tr>

<th>ID</th>

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
{order.id}
</td>

<td>
{
order.customer
}
</td>

<td>
₹{
order.amount
}
</td>

<td>
{
order.payment
}
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

<button>
View
</button>

<button>
Print
</button>

</td>

</tr>

)

)
}

</tbody>

</table>

</div>

</div>

);

}
