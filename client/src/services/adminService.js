import api from "./api";

export const getOverview = () => api.get("/admin/overview").then((r) => r.data);
export const getUsers = (role) => api.get("/admin/users", { params: { role } }).then((r) => r.data);
export const setVerified = (id, isVerified) =>
    api.patch(`/admin/ngos/${id}/verify`, { isVerified }).then((r) => r.data);