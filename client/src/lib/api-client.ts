import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { RetryableRequestConfig } from "@types/api";

export const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true, // allows the browser to send cookies with cross-origin requests
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(response);
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh-token");
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
