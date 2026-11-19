import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL.replace("/api", "");

export const connectSocket = () =>
    io(URL, { auth: { token: localStorage.getItem("baant_token") } });