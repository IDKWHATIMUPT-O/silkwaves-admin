import { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  Truck,
  Settings2,
  Users,
  UserCog,
  BarChart3,
  FileText
} from "lucide-react";
import AdminLayout from './components/layout/AdminLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddProduct from './pages/AddProduct.jsx';
import ManageProducts from './pages/ManageProducts.jsx';
import Orders from './pages/Orders.jsx';
import Login from './pages/Login.jsx';
import Fulfillment from './pages/Fulfillment.jsx'; // ⭐ NEW
import Settings from "./pages/Settings.jsx";
import Customers from "./pages/Customers.jsx";
import Employees from "./pages/Employees.jsx";
import Reports from "./pages/Reports.jsx";
import Vouchers from "./pages/Vouchers.jsx";
import { getProducts } from './services/productsApi.js';
import { getMe } from './services/authApi.js';

const NAV_ITEMS = [

  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    section: 'dashboard'
  },

  {
    id: 'orders',
    label: 'Orders',
    icon: PackageSearch,
    section: 'orders'
  },

  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
    section: 'customers'
  },

  // ⭐ NEW
  {
    id: 'fulfillment',
    label: 'Fulfillment',
    icon: Truck,
    section: 'fulfillment'
  },

  {
    id: 'add-product',
    label: 'Add Product',
    icon: PackagePlus,
    section: 'products'
  },

  {
    id: 'manage-products',
    label: 'Manage Products',
    icon: PackageSearch,
    section: 'products'
  },

  {
    id: "settings",
    label: "Settings",
    icon: Settings2,
    section: 'settings'
  },

  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    section: 'reports'
  },

  {
    id: 'vouchers',
    label: 'Vouchers',
    icon: FileText,
    section: 'orders'
  },

  {
    id: 'employees',
    label: 'Employees',
    icon: UserCog,
    adminOnly: true
  }
];

export default function App() {

  const [activePage, setActivePage] =
    useState('dashboard');

  const [isLoggedIn, setIsLoggedIn] =
useState(
  !!localStorage.getItem("token")
);

  const [account, setAccount] = useState(null);

  const [products, setProducts] =
    useState([]);

    const [dashboardData, setDashboardData] = useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  async function loadProducts() {

    setIsLoading(true);
    setError('');

    try {

      const data =
        await getProducts();

      setProducts(
        Array.isArray(data)
          ? data
          : data.products || []
      );

    } catch (requestError) {

      setProducts([]);
      setError(
        requestError.message
      );

    } finally {

      setIsLoading(false);

    }

  }
async function loadDashboard() {

  try {

    const token = localStorage.getItem("token");

    const res = await fetch(

      `${import.meta.env.VITE_API_BASE_URL}/dashboard`,

      {

        headers: {

          Authorization: `Bearer ${token}`

        }

      }

    );

    if (!res.ok) {

      throw new Error("Failed to load dashboard");

    }

    const data = await res.json();

    console.log("Dashboard:", data);

    setDashboardData(data);

  }

  catch (err) {

    console.error(err);

  }

}

  async function loadAccount() {

    try {

      const me = await getMe();
      setAccount(me);

    } catch (err) {

      console.error(err);

    }

  }

  useEffect(() => {

  if (!isLoggedIn) return;

  loadProducts();
  loadDashboard();
  loadAccount();

}, [isLoggedIn]);

  const isAdmin = account?.role === 'admin';

  function canView(section) {
    if (!account) return false;
    if (isAdmin) return true;
    return !!account.permissions?.[section]?.view;
  }

  function canEdit(section) {
    if (!account) return false;
    if (isAdmin) return true;
    return !!account.permissions?.[section]?.edit;
  }

  const visibleNavItems = useMemo(

    () => NAV_ITEMS.filter((item) => {
      if (item.adminOnly) return isAdmin;
      return canView(item.section);
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account]

  );

  useEffect(() => {

    if (!account) return;

    const stillVisible = visibleNavItems.some((item) => item.id === activePage);

    if (!stillVisible && visibleNavItems.length > 0) {
      setActivePage(visibleNavItems[0].id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const pageTitle =
    useMemo(

      () =>

        NAV_ITEMS.find(
          item => item.id === activePage
        )?.label || 'Dashboard',

      [activePage]

    );

  if (!isLoggedIn) {

    return (

      <Login

        onLogin={() => {
          setIsLoggedIn(true);
        }}

      />

    );

  }

  return (

    <AdminLayout

      activePage={activePage}
      navItems={visibleNavItems}
      onNavigate={setActivePage}
      pageTitle={pageTitle}

      onLogout={() => {

  localStorage.removeItem("token");

  setIsLoggedIn(false);
  setAccount(null);

}}

    >

      {activePage === 'dashboard' && (

        <Dashboard

  error={error}

  isLoading={isLoading}

  products={products}

  dashboardData={dashboardData}

/>

      )}

      {activePage === 'add-product' && (

        <AddProduct

          onCreated={loadProducts}
          onNavigate={setActivePage}
          canEdit={canEdit('products')}

        />

      )}

      {activePage === 'orders' &&

        <Orders canEdit={canEdit('orders')} isAdmin={isAdmin} />

      }

      {activePage === 'customers' &&

        <Customers isAdmin={isAdmin} />

      }

      {activePage === 'reports' &&

        <Reports isAdmin={isAdmin} />

      }

      {activePage === 'vouchers' &&

        <Vouchers canEdit={canEdit('orders')} />

      }

      {/* ⭐ NEW */}

      {activePage === 'fulfillment' &&

        <Fulfillment canEdit={canEdit('fulfillment')} />

      }
{activePage==="settings" &&

<Settings canEdit={canEdit('settings')} />

}
      {activePage === 'manage-products' && (

        <ManageProducts

          error={error}
          isLoading={isLoading}
          onProductsChanged={loadProducts}
          products={products}
          canEdit={canEdit('products')}
          isAdmin={isAdmin}

        />

      )}

      {activePage === 'employees' && isAdmin && (

        <Employees />

      )}

    </AdminLayout>

  );

}
