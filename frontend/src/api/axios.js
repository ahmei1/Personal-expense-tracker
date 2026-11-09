import axios from "axios";

const configured = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function resolveApiBase(value) {
  if (value.startsWith("/")) {
    return value.replace(/\/$/, "");
  }

  const apiUrl = new URL(value);
  const pageHost = window.location.hostname;
  const localHosts = new Set(["localhost", "127.0.0.1"]);

  // Local dev may be opened as localhost or 127.0.0.1. Keep the API on that
  // same host so the login cookie is stored and sent. Production uses either
  // a relative /api path (proxied by Vercel) or the configured API host.
  if (localHosts.has(pageHost) && localHosts.has(apiUrl.hostname)) {
    apiUrl.hostname = pageHost;
  }

  return `${apiUrl.origin}${apiUrl.pathname.replace(/\/$/, "")}`;
}

const api = axios.create({
  baseURL: resolveApiBase(configured),
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
