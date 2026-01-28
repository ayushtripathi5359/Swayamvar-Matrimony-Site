import { clearAccessToken, getAccessToken, setAccessToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const refreshAccessToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include"
  });

  if (!response.ok) {
    clearAccessToken();
    return null;
  }

  const data = await response.json();
  if (data.accessToken) {
    setAccessToken(data.accessToken);
    return data.accessToken;
  }

  return null;
};

export const apiFetch = async (
  path: string,
  options: RequestInit = {},
  retryOnUnauthorized = true
) => {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });

  if (response.status === 401 && retryOnUnauthorized) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiFetch(path, options, false);
    }
  }

  return response;
};

export const apiBaseUrl = API_BASE_URL;
