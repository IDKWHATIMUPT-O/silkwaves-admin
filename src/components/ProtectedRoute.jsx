import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
children
}){

const auth=
localStorage.getItem(
"admin-auth"
);

if(!auth){
return(
<Navigate
to="/login"
/>
);
}

return children;
}