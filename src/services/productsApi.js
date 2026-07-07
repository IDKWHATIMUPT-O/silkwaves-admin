const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error(
      "Missing VITE_API_BASE_URL. Add it to your local .env file."
    );
  }

  return API_BASE_URL.replace(/\/$/, "");
}

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),

    ...options.headers,
  };

  const response = await fetch(
    `${getApiBaseUrl()}${path}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");

    throw new Error(
      errorText || `Request failed with status ${response.status}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getProducts() {
  return request("/products");
}

export function createProduct(product) {
  return request("/products", {
    method: "POST",
    body: product,
  });
}

export function updateProduct(productId, product) {
  return request(`/products/${productId}`, {
    method: "PUT",
    body: product,
  });
}

export function deleteProduct(productId) {
  return request(`/products/${productId}`, {
    method: "DELETE",
  });
}