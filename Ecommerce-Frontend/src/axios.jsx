import axios from "axios";

const api = axios.create({
  baseURL: "http://52.55.8.58:8080/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Unauthorized or Forbidden request");
    }

    return Promise.reject(error);
  }
);

export default api;