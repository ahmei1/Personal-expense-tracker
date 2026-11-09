import axios from "axios";

const configured = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const apiUrl = new URL(configured);

// Keep the API on the same host as the page so the login cookie is sent.
apiUrl.hostname = window.location.hostname;

const api = axios.create({
  baseURL: `${apiUrl.origin}${apiUrl.pathname.replace(/\/$/, "")}`,
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
