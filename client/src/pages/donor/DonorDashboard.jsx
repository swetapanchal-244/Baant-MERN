import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Utensils, Users, CheckCircle2, Clock } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import StatusBadge from "../../components/food/StatusBadge";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { getMyFood } from "../../services/foodService";
import toast from "react-hot-toast";
import useSocket from "../../hooks/useSocket";
import { normalize } from "../../services/foodService";
import WeeklyChart from "../../components/dashboard/WeeklyChart";
import { getDonorStats } from "../../services/statsService";

export default function DonorDashboard() {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);

    const [weekly, setWeekly] = useState([]);

    useEffect(() => {
        getDonorStats().then((s) => setWeekly(s.weekly)).catch(console.error);
    }, []);

    useEffect(() => {
        getMyFood().then(setDonations).catch(console.error);
    }, []);

    useSocket({
        "food:updated": (raw) => {
            const f = normalize(raw);
            setDonations((prev) => prev.map((d) => (d.id === f.id ? f : d)));
            const msg = {
                accepted: `${f.ngo} ne aapka khana accept kiya`,
                picked: `${f.ngo} ne khana pickup kar liya`,
                delivered: `Khana deliver ho gaya. Shukriya!`,
            }[f.status];
            if (msg) toast.success(msg);
        },
    });

    const total = donations.length;
    const meals = donations.reduce((sum, d) => sum + d.quantity, 0);
    const delivered = donations.filter((d) => d.status === "delivered").length;
    const active = donations.filter((d) => d.status === "available" || d.status === "accepted").length;

    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-wrap items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold">Namaste, {user?.name?.split(" ")[0]} 👋</h1>
                    <p className="mt-1 text-muted">Aaj kisi ki thaali bharne ka din hai.</p>
                </div>
                <Link to="/donor/add">
                    <Button className="flex items-center gap-2"><Plus size={16} /> Naya khana post karo</Button>
                </Link>
            </motion.div>

            <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard icon={Utensils} label="Total donations" value={total} tint="bg-mint text-sage-dark" />
                <StatCard icon={Users} label="Meals diye" value={meals} tint="bg-peach-soft text-peach" />
                <StatCard icon={CheckCircle2} label="Deliver hue" value={delivered} tint="bg-mint text-sage-dark" />
                <StatCard icon={Clock} label="Active posts" value={active} tint="bg-peach-soft text-peach" />
            </div>

            <div className="mb-10">
                <WeeklyChart data={weekly} title="Is hafte aapne kitne meals diye" />
            </div>

            <h2 className="mb-4 text-xl font-bold">Meri donations</h2>
            <div className="space-y-3">
                {donations.map((d, i) => (
                    <motion.div
                        key={d.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center gap-4 rounded-2xl border border-sand bg-white p-3"
                    >
                        <img src={d.image} alt={d.title} className="h-16 w-16 rounded-xl object-cover sm:h-20 sm:w-20" />
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate font-bold">{d.title}</h3>
                            <p className="text-sm text-muted">{d.quantity} logon ka khana • {d.time}</p>
                            {d.ngo && <p className="text-xs text-sage-dark">NGO: {d.ngo}</p>}
                        </div>
                        <StatusBadge status={d.status} />
                    </motion.div>
                ))}

                {donations.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-sand bg-white p-8 text-center text-muted">
                        Abhi koi donation nahi. Pehla khana post karo!
                    </p>
                )}
            </div>
        </DashboardLayout>
    );
}