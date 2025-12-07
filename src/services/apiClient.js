import axios, { AxiosError } from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";
// Biến lưu access token trong memory
// let accessToken = null;
let accessToken = localStorage.getItem("access_token") || null;

let userDetail = null;
// Axios instance
const apiClient = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Thêm access token vào header
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý refresh token khi access token hết hạn
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(`${SERVER_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        console.log("Refresh token response:", response.data);
        // Lấy access_token và refresh_token mới từ response
        const newAccessToken = response.data.data.access_token;
        const newRefreshToken = response.data.data.refresh_token;
        console.log("newAccessToken:", newAccessToken);
        console.log("newRefreshToken:", newRefreshToken);

        // Lưu access token mới vào memory
        accessToken = newAccessToken;

        // Lưu refresh token mới vào localStorage
        localStorage.setItem("refresh_token", newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token hết hạn, logout user
        // localStorage.removeItem("refresh_token");

        accessToken = null;
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export const tokenManager = {
  get token() {
    return accessToken;
  },
  set token(value) {
    accessToken = value;
  },
};

export const userManager = {
  get user() {
    return userDetail;
  },
  set user(value) {
    userDetail = value;
  },
};
export default apiClient;
