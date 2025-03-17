import axios from "axios";

const api = axios.create({
  baseURL: "https://api.skillsoft.uz/",
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use(config => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization; 
  }

  return config;
}, error => Promise.reject(error));

export default api;
