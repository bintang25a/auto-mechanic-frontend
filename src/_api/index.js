import axios from "axios";

const API = axios.create({
  baseURL: "https://c494-2a09-bac1-6500-8-00-3c3-42.ngrok-free.app/api",
  // baseURL: "http://127.0.0.1:8000/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.headers["ngrok-skip-browser-warning"] = "true";

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
