# SILKWAVES Admin CMS

Local-only React admin dashboard for managing SILKWAVES saree products through the backend API.

## Folder Structure

```text
silkwaves-admin/
  src/
    components/
      dashboard/DashboardCard.jsx
      layout/AdminLayout.jsx
      layout/Sidebar.jsx
      layout/Topbar.jsx
      products/ProductForm.jsx
      products/ProductTable.jsx
      ui/Button.jsx
      ui/Modal.jsx
    constants/categories.js
    pages/AddProduct.jsx
    pages/Dashboard.jsx
    pages/ManageProducts.jsx
    services/productsApi.js
    styles/global.css
    App.jsx
    main.jsx
```

## API Integration

Set the backend base URL in a local `.env` file:

```env
VITE_API_BASE_URL=https://your-backend.example.com
```

The app calls:

```text
GET /products
POST /products
PUT /products/:id
DELETE /products/:id
```

Create and update requests are sent as `multipart/form-data`.

Expected product payload fields:

```text
title
price
category
description
coverImage       single uploaded file
galleryImages    up to 4 uploaded files
```

## Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.
