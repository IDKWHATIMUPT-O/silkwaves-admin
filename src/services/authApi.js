const API = import.meta.env.VITE_API_BASE_URL;

export async function login(email, password) {

  const response = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Login failed"
    );
  }

  return data;

}

export async function getMe() {

  const token = localStorage.getItem("token");

  const response = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to load account");
  }

  return data;

}