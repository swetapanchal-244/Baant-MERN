import api from "./api";

export const getMe = () => api.get("/auth/me").then((r) => r.data);
export const updateProfile = (data) => api.put("/auth/profile", data).then((r) => r.data);
export const changePassword = (data) => api.put("/auth/password", data).then((r) => r.data);