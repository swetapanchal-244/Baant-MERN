import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, Navigation, Building2 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import FoodMap from "../../components/food/FoodMap";
import Button from "../../components/common/Button";
import useGeolocation from "../../hooks/useGeolocation";
import { getNearby, acceptFood } from "../../services/foodService";
import { getError } from "../../services/api";
import { NGO_CENTER } from "../../utils/constants";
import { distanceKm } from "../../utils/distance";
import toast from "react-hot-toast";
import useSocket from "../../hooks/useSocket";
import { normalize } from "../../services/foodService";

export default function NearbyFood() {
    const navigate = useNavigate();
    const { coords, detect, error: geoError } = useGeolocation();
    const [radius, setRadius] = useState(5);
    const [foods, setFoods] = useState([]);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState("");

    const center = coords || NGO_CENTER;

    useEffect(() => {
        detect();
    }, []);

    useEffect(() => {
        const t = setTimeout(() => {
            getNearby(center.lat, center.lng, radius)
                .then((list) =>
                    setFoods(list.map((f) => ({ ...f, distance: distanceKm(center.lat, center.lng, f.lat, f.lng) })))
                )
                .catch((e) => setError(getError(e)));
        }, 300);
        return () => clearTimeout(t);
    }, [center.lat, center.lng, radius]);

    useSocket({
        "food:new": (raw) => {
            const f = normalize(raw);
            const distance = distanceKm(center.lat, center.lng, f.lat, f.lng);
            if (distance <= radius) {
                setFoods((prev) => [{ ...f, distance }, ...prev]);
                toast.success(`Naya khana: ${f.title} (${distance.toFixed(1)} km)`);
            }
        },
        "food:updated": (raw) => {

            if (raw.status !== "available") {
                setFoods((prev) => prev.filter((f) => f.id !== raw._id));
            }
        },
    });

    const accept = async (id) => {
        try {
            await acceptFood(id);
            navigate("/ngo/pickups");
        } catch (e) {
            setError(getError(e));
            if (e.response?.status === 409) setFoods((prev) => prev.filter((f) => f.id !== id));
        }
    };

    return (
        <DashboardLayout wide>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold">Aaspaas ka khana</h1>
                    <p className="mt-1 text-muted">
                        {foods.length} posts aapke {radius} km ke andar hain.
                        {!coords && " (Location detect ho rahi hai...)"}
                    </p>
                </div>
                <div className="w-full rounded-2xl border border-sand bg-white p-4 sm:w-72">
                    <div className="mb-2 flex justify-between text-sm font-semibold">
                        <span>Distance</span>
                        <span className="text-sage-dark">{radius} km</span>
                    </div>
                    <input type="range" min={1} max={20} value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-sage" />
                </div>
            </div>

            {geoError && (
                <p className="mb-4 rounded-xl bg-peach-soft p-3 text-sm text-peach">
                    Aapki location nahi mili, isliye abhi Delhi ka default map dikh raha hai. Browser me Location allow karke page refresh karo.
                </p>
            )}

            {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

            <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                    <FoodMap center={center} radiusKm={radius} foods={foods} selected={selected} onSelect={setSelected} />
                </div>

                <div className="space-y-3 lg:col-span-2 lg:max-h-[520px] lg:overflow-y-auto lg:pr-1" data-lenis-prevent>
                    <AnimatePresence>
                        {foods.map((f) => (
                            <motion.div key={f.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }} onClick={() => setSelected(f)}
                                className={`cursor-pointer rounded-2xl border bg-white p-3 transition ${selected?.id === f.id ? "border-peach shadow-lg shadow-peach/20" : "border-sand hover:border-sage"
                                    }`}>
                                <div className="flex gap-3">
                                    <img src={f.image} alt={f.title} className="h-20 w-20 rounded-xl object-cover" />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate font-bold">{f.title}</h3>
                                        <p className="flex items-center gap-1.5 text-xs text-muted"><Building2 size={13} /> {f.donor}</p>
                                        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                                            <span className="flex items-center gap-1"><Users size={13} /> {f.quantity} log</span>
                                            <span className="flex items-center gap-1"><Navigation size={13} /> {f.distance.toFixed(1)} km</span>
                                            <span className="flex items-center gap-1 text-peach"><Clock size={13} /> {f.expiry}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button className="mt-3 w-full" onClick={(e) => { e.stopPropagation(); accept(f.id); }}>
                                    Accept karo
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {foods.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-sand bg-white p-8 text-center text-sm text-muted">
                            Is distance me abhi koi khana nahi hai. Slider badhao ya thodi der baad dekho.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}