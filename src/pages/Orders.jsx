import { useEffect, useState } from 'react';

export default function Orders(){

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

if(loading){

return <h2>Loading...</h2>;

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
style={{
background:'white',
padding:'20px',
borderRadius:'20px'
}}
>

<table
style={{
width:'100%',
borderCollapse:'collapse'
}}
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
{order.customer}
</td>

<td>
₹{order.amount}
</td>

<td>
{order.payment}
</td>

<td>
{order.status}
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
