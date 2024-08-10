import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true, //  allows the browser to send cookies with cross-origin requests
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
    (response) => response.data,
    async (error: AxiosError) => {
        return Promise.reject(error);
    }
);

const _refreshToken = async (): Promise<void> => {
    // TODO: Implement refresh token logic
};

const _handleAuthError = (): void => {
    // TODO: Implement authentication error handling logic i.e., logout + state management
    // e.g., Cookies.remove("accessToken");
};
