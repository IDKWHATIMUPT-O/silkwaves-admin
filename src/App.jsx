import { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  Truck,
  Settings2
} from "lucide-react";
import AdminLayout from './components/layout/AdminLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddProduct from './pages/AddProduct.jsx';
import ManageProducts from './pages/ManageProducts.jsx';
import Orders from './pages/Orders.jsx';
import Login from './pages/Login.jsx';
import Fulfillment from './pages/Fulfillment.jsx'; // ⭐ NEW
import Settings from "./pages/Settings.jsx";
import { getProducts } from './services/productsApi.js';

const NAV_ITEMS = [

  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },

  {
    id: 'orders',
    label: 'Orders',
    icon: PackageSearch
  },

  // ⭐ NEW
  {
    id: 'fulfillment',
    label: 'Fulfillment',
    icon: Truck
  },

  {
    id: 'add-product',
    label: 'Add Product',
    icon: PackagePlus
  },

  {
    id: 'manage-products',
    label: 'Manage Products',
    icon: PackageSearch
  },

  {
    id: "settings",
    label: "Settings",
    icon: Settings2
  }
];

export default function App() {

  const [activePage, setActivePage] =
    useState('dashboard');

  const [isLoggedIn, setIsLoggedIn] =
useState(
  !!localStorage.getItem("token")
);

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
  useEffect(() => {

  loadProducts();
  loadDashboard();

}, []);

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
      navItems={NAV_ITEMS}
      onNavigate={setActivePage}
      pageTitle={pageTitle}

      onLogout={() => {

  localStorage.removeItem("token");

  setIsLoggedIn(false);

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

        />

      )}

      {activePage === 'orders' &&

        <Orders />

      }

      {/* ⭐ NEW */}

      {activePage === 'fulfillment' &&

        <Fulfillment />

      }
{activePage==="settings" &&

<Settings/>

}
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