import axios from "axios";

const api = axios.create({
  baseURL: "https://api.skillsoft.uz/",
  headers: { "Content-Type": "application/json" },
});

// Функция для удаления токена из cookie
const removeToken = () => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// Добавляем токен в запросы
api.interceptors.request.use(config => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
}, error => Promise.reject(error));

api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    removeToken(); 
    window.location.href = "/login"; 
  }

  return Promise.reject(error);
});

export default api;
