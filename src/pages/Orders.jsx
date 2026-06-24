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
const header={
textAlign:'left',
padding:'16px',
borderBottom:'1px solid #eee'
};

const cell={
padding:'18px 16px',
borderBottom:'1px solid #f4f4f4'
};

export default function Orders(){

return (

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
borderRadius:'20px',
padding:'20px',
marginTop:'24px',
overflowX:'auto'
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

<th style={header}>
ID
</th>

<th style={header}>
Customer
</th>

<th style={header}>
Items
</th>

<th style={header}>
Amount
</th>

<th style={header}>
Payment
</th>

<th style={header}>
Status
</th>

</tr>

</thead>

<tbody>

{
SAMPLE_ORDERS.map(
(order)=>(

<tr
key={order.id}
>

<td style={cell}>
{order.id}
</td>

<td style={cell}>
{order.customer}
</td>

<td style={cell}>
{order.items}
</td>

<td style={cell}>
₹{order.amount}
</td>

<td style={cell}>
{order.payment}
</td>

<td style={cell}>
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