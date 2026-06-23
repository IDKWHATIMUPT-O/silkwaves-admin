import { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, PackagePlus, PackageSearch } from 'lucide-react';
import AdminLayout from './components/layout/AdminLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddProduct from './pages/AddProduct.jsx';
import ManageProducts from './pages/ManageProducts.jsx';
import { getProducts } from './services/productsApi.js';
import Login from './pages/Login.jsx';
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'add-product', label: 'Add Product', icon: PackagePlus },
  { id: 'manage-products', label: 'Manage Products', icon: PackageSearch },
];

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem('admin-auth') === 'true'
);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadProducts() {
    setIsLoading(true);
    setError('');

    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (requestError) {
      setProducts([]);
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const pageTitle = useMemo(
    () => NAV_ITEMS.find((item) => item.id === activePage)?.label || 'Dashboard',
    [activePage],
  );
  if (!isLoggedIn) {
return (
<Login
onLogin={()=>{
localStorage.setItem(
'admin-auth',
'true'
);

setIsLoggedIn(true);
}}
/>
);
}
function logout() {
  localStorage.removeItem("admin-auth");
  window.location.reload();
}
  return (
    <AdminLayout
activePage={activePage}
navItems={NAV_ITEMS}
onNavigate={setActivePage}
pageTitle={pageTitle}

onLogout={()=>{
localStorage.removeItem(
"admin-auth"
);

window.location.reload();
}}
>
      {activePage === 'dashboard' && (
        <Dashboard error={error} isLoading={isLoading} products={products} />
      )}

      {activePage === 'add-product' && (
        <AddProduct onCreated={loadProducts} onNavigate={setActivePage} />
      )}

      {activePage === 'manage-products' && (
        <ManageProducts
          error={error}
          isLoading={isLoading}
          onProductsChanged={loadProducts}
          products={products}
        />
      )}
    </AdminLayout>
  );
}
