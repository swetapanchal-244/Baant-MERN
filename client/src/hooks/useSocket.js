import { useEffect, useRef } from "react";
import { connectSocket } from "../services/socket";

// handlers: { "food:new": fn, "food:updated": fn }
export default function useSocket(handlers) {
    const ref = useRef(handlers);
    ref.current = handlers;

    useEffect(() => {
        const socket = connectSocket();
        Object.keys(ref.current).forEach((event) => {
            socket.on(event, (data) => ref.current[event](data));
        });
        return () => socket.disconnect();
    }, []);
}