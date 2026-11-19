import api from "./api";

export const getPublicStats = () => api.get("/stats/public").then((r) => r.data);
export const getDonorStats = () => api.get("/stats/donor").then((r) => r.data);
export const getNgoStats = () => api.get("/stats/ngo").then((r) => r.data);