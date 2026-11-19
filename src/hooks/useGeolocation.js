import { useState } from "react";

export default function useGeolocation() {
    const [coords, setCoords] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const detect = () => {
        if (!navigator.geolocation) {
            setError("Is browser me location support nahi hai");
            return;
        }
        setLoading(true);
        setError("");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLoading(false);
            },
            () => {
                setError("Location permission do ya manually address likho");
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return { coords, loading, error, detect };
}