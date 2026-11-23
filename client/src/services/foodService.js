import api from "./api";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400";

export function timeLeft(iso) {
    const mins = Math.round((new Date(iso) - Date.now()) / 60000);
    if (mins <= 0) return "expire ho gaya";
    if (mins < 60) return `${mins} min`;
    return `${Math.round(mins / 60)} ghante`;
}

export const normalize = (f) => ({
    id: f._id,
    title: f.title,
    quantity: f.quantity,
    image: f.image || FALLBACK_IMG,
    address: f.address,
    status: f.status,
    lat: f.location.coordinates[1],
    lng: f.location.coordinates[0],
    expiry: timeLeft(f.expiryTime),
    donor: f.donor?.name || "Donor",
    donorPhone: f.donor?.phone || null,
    ngo: f.acceptedBy?.orgName || f.acceptedBy?.name || null,
    time: new Date(f.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }),
});

export const createFood = (data) => api.post("/food", data).then((r) => r.data);
export const getMyFood = () => api.get("/food/mine").then((r) => r.data.map(normalize));
export const getNearby = (lat, lng, radius) =>
    api.get("/food/nearby", { params: { lat, lng, radius } }).then((r) => r.data.map(normalize));
export const getPickups = () => api.get("/food/pickups").then((r) => r.data.map(normalize));
export const acceptFood = (id) => api.patch(`/food/${id}/accept`).then((r) => r.data);
export const setStatus = (id, status) => api.patch(`/food/${id}/status`, { status }).then((r) => r.data);
