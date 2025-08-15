import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://localhost:7240',
  timeout: 60000,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
