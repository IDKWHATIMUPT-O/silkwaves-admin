const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export function getCustomers() {
  return request("/admin/customers");
}

export function getCustomer(id) {
  return request(`/admin/customers/${id}`);
}
