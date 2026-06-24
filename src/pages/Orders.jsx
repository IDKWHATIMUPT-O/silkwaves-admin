const SAMPLE_ORDERS = [
{
id:"SW1001",
customer:"Yogesh",
items:2,
amount:12999,
payment:"Pending",
status:"Placed"
}
];

export default function Orders(){

return(

<div>

<span className="eyebrow">
ORDERS
</span>

<h1>
Orders
</h1>

<table
style={{
width:'100%',
marginTop:'20px'
}}
>

<thead>

<tr>
<th>ID</th>
<th>Customer</th>
<th>Items</th>
<th>Amount</th>
<th>Payment</th>
<th>Status</th>
</tr>

</thead>

<tbody>

{
SAMPLE_ORDERS.map(
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
{order.items}
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

);

}