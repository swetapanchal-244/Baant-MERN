import { motion } from "framer-motion";
import { MapPin, Users, PackageOpen } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusTimeline from "../../components/food/StatusTimeline";
import Button from "../../components/common/Button";
import { useFood } from "../../context/FoodContext";

const nextAction = {
    accepted: { label: "Pickup ho gaya", next: "picked" },
    picked: { label: "Deliver ho gaya", next: "delivered" },
};

export default function MyPickups() {
    const { foods, updateStatus } = useFood();
    const mine = foods.filter((f) => ["accepted", "picked", "delivered"].includes(f.status));

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-extrabold">Meri pickups</h1>
            <p className="mb-8 mt-1 text-muted">Accept kiya hua khana yahan track karo.</p>

            {mine.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-sand bg-white p-12 text-center">
                    <PackageOpen size={40} className="mx-auto mb-3 text-muted" />
                    <p className="text-muted">Abhi koi pickup nahi hai. Nearby khana se kuch accept karo.</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {mine.map((f, i) => {
                        const action = nextAction[f.status];
                        return (
                            <motion.div
                                key={f.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="rounded-3xl border border-sand bg-white p-5"
                            >
                                <div className="mb-5 flex gap-4">
                                    <img src={f.image} alt={f.title} className="h-20 w-20 rounded-2xl object-cover" />
                                    <div>
                                        <h3 className="text-lg font-bold">{f.title}</h3>
                                        <p className="text-sm text-muted">{f.donor}</p>
                                        <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted">
                                            <span className="flex items-center gap-1"><Users size={13} /> {f.quantity} log</span>
                                            <span className="flex items-center gap-1"><MapPin size={13} /> {f.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <StatusTimeline status={f.status} />

                                {action ? (
                                    <Button className="mt-5 w-full" onClick={() => updateStatus(f.id, action.next)}>
                                        {action.label}
                                    </Button>
                                ) : (
                                    <p className="mt-5 rounded-xl bg-mint p-3 text-center text-sm font-semibold text-sage-dark">
                                        Deliver ho gaya. Shukriya, {f.quantity} logon ka pet bhara!
                                    </p>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </DashboardLayout>
    );
}