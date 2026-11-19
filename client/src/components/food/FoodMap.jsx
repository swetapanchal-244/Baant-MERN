import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pin = (color) =>
    L.divIcon({
        className: "",
        html: `<div style="background:${color};width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,.25)"></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34],
    });

const foodPin = pin("#5B9A7E");
const activePin = pin("#F4A77A");
const meIcon = L.divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;border-radius:50%;background:#2B3A33;border:4px solid white;box-shadow:0 0 0 6px rgba(43,58,51,.2)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

function FlyTo({ target }) {
    const map = useMap();
    useEffect(() => {
        if (target) map.flyTo([target.lat, target.lng], 15, { duration: 1 });
    }, [target, map]);
    return null;
}

export default function FoodMap({ center, radiusKm, foods, selected, onSelect }) {
    return (
        <div data-lenis-prevent className="h-80 overflow-hidden rounded-3xl border border-sand lg:h-[520px]">
            <MapContainer center={[center.lat, center.lng]} zoom={13} scrollWheelZoom className="h-full w-full">
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[center.lat, center.lng]} icon={meIcon}>
                    <Popup>Aap yahan ho</Popup>
                </Marker>
                <Circle
                    center={[center.lat, center.lng]}
                    radius={radiusKm * 1000}
                    pathOptions={{ color: "#5B9A7E", fillColor: "#5B9A7E", fillOpacity: 0.08, weight: 1.5 }}
                />
                {foods.map((f) => (
                    <Marker
                        key={f.id}
                        position={[f.lat, f.lng]}
                        icon={selected?.id === f.id ? activePin : foodPin}
                        eventHandlers={{ click: () => onSelect(f) }}
                    >
                        <Popup>
                            <b>{f.title}</b>
                            <br />
                            {f.quantity} logon ka khana
                        </Popup>
                    </Marker>
                ))}
                <FlyTo target={selected} />
            </MapContainer>
        </div>
    );
}