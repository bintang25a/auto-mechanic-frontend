import axios from "axios";

const API = axios.create({
  baseURL:
    "https://f4d2-2405-8180-401-7d68-fcc3-81ab-7ae5-f98b.ngrok-free.app/api",
  // baseURL: "https://3a28-114-79-4-126.ngrok-free.app/api",
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
