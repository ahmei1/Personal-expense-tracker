import axios from "axios";

const localHosts = new Set(["localhost", "127.0.0.1"]);

function resolveApiBase() {
  const pageHost = window.location.hostname;

  // The hosted app calls /api on its own domain. Vercel proxies that path to
  // the API, so the login cookie is first-party and signup is not blocked by CORS.
  if (!localHosts.has(pageHost)) {
    return "/api";
  }

  const configured = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  if (configured.startsWith("/")) {
    return configured.replace(/\/$/, "");
  }

  const apiUrl = new URL(configured);

  // Local dev may be opened as localhost or 127.0.0.1. Keep the API on that
  // same host so the login cookie is stored and sent.
  if (localHosts.has(apiUrl.hostname)) {
    apiUrl.hostname = pageHost;
  }

  return `${apiUrl.origin}${apiUrl.pathname.replace(/\/$/, "")}`;
}

const api = axios.create({
  baseURL: resolveApiBase(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const status = error.response?.status;

    if (status === 401 && !url.includes("/auth/login")) {
      window.dispatchEvent(new Event("unauthorized"));
    }

    return Promise.reject(error);
  },
);

export default api;
