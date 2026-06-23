import { useState } from 'react';

export default function Login({
onLogin
}) {

const [email,setEmail]=useState('');
const [password,setPassword]=useState('');

function handleSubmit(e){
e.preventDefault();

if(
email==='admin@silkwaves.in' &&
password==='silkwaves123'
){
onLogin();
}else{
alert(
'Wrong credentials'
);
}
}

return(
<div
style={{
height:'100vh',
display:'flex',
alignItems:'center',
justifyContent:'center'
}}
>

<form
onSubmit={handleSubmit}
style={{
display:'flex',
flexDirection:'column',
gap:'12px',
width:'300px'
}}
>

<h1>Admin Login</h1>

<input
placeholder="Email"
value={email}
onChange={(e)=>
setEmail(
e.target.value
)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>
setPassword(
e.target.value
)}
/>

<button>
Login
</button>

</form>

</div>
);
}