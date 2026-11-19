import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("baant_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const url = err.config?.url || "";
        const isAuthCall = url.includes("/auth/login") || url.includes("/auth/register");
        if (err.response?.status === 401 && !isAuthCall) {
            localStorage.removeItem("baant_token");
            localStorage.removeItem("baant_user");
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export const getError = (err) =>
    err.response?.data?.message || "Server se connect nahi ho paya. Backend chal raha hai?";

export default api;