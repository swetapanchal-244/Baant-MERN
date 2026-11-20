import { useEffect, useState } from "react";
import { Users, Building2, BadgeCheck, Utensils, Clock } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import { getOverview, getUsers, setVerified } from "../../services/adminService";
import { getError } from "../../services/api";

export default function AdminPanel() {
    const [overview, setOverview] = useState(null);
    const [tab, setTab] = useState("ngo");
    const [users, setUsers] = useState([]);

    const loadOverview = () => getOverview().then(setOverview).catch(console.error);

    useEffect(() => {
        loadOverview();
    }, []);

    useEffect(() => {
        getUsers(tab).then(setUsers).catch(console.error);
    }, [tab]);

    const toggle = async (u) => {
        try {
            const updated = await setVerified(u._id, !u.isVerified);
            setUsers((prev) => prev.map((x) => (x._id === u._id ? updated : x)));
            loadOverview();
            toast.success(updated.isVerified ? "NGO verify ho gaya" : "Verification hata di");
        } catch (e) {
            toast.error(getError(e));
        }
    };

    return (
        <DashboardLayout wide>
            <h1 className="text-3xl font-extrabold">Admin panel</h1>
            <p className="mb-8 mt-1 text-muted">Baant ke saare users aur NGOs ek jagah.</p>

            {overview && (
                <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-5">
                    <StatCard icon={Users} label="Donors" value={overview.donors} tint="bg-mint text-sage-dark" />
                    <StatCard icon={Building2} label="NGOs" value={overview.ngos} tint="bg-peach-soft text-peach" />
                    <StatCard icon={BadgeCheck} label="Verified NGOs" value={overview.verifiedNgos} tint="bg-mint text-sage-dark" />
                    <StatCard icon={Clock} label="Pending NGOs" value={overview.pendingNgos} tint="bg-peach-soft text-peach" />
                    <StatCard icon={Utensils} label="Meals deliver hue" value={overview.meals} tint="bg-mint text-sage-dark" />
                </div>
            )}

            <div className="mb-5 flex gap-2">
                {[
                    { id: "ngo", label: "NGOs" },
                    { id: "donor", label: "Donors" },
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${tab === t.id ? "bg-sage text-white" : "bg-white text-muted border border-sand"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {users.map((u) => (
                    <div key={u._id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-sand bg-white p-4">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-mint font-bold text-sage-dark">
                            {(u.orgName || u.name)[0]?.toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-bold">{u.role === "ngo" ? u.orgName : u.name}</p>
                            <p className="truncate text-sm text-muted">
                                {u.role === "ngo" && `${u.name} • `}
                                {u.email} • {u.phone}
                            </p>
                            <p className="text-xs text-muted">
                                Joined {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                        </div>
                        {u.role === "ngo" && (
                            <button
                                onClick={() => toggle(u)}
                                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${u.isVerified
                                        ? "bg-mint text-sage-dark hover:bg-peach-soft hover:text-peach"
                                        : "bg-sage text-white hover:bg-sage-dark"
                                    }`}
                            >
                                {u.isVerified ? "Verified (hatao)" : "Verify karo"}
                            </button>
                        )}
                    </div>
                ))}
                {users.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-sand bg-white p-8 text-center text-muted">
                        Abhi koi {tab === "ngo" ? "NGO" : "donor"} nahi hai.
                    </p>
                )}
            </div>
        </DashboardLayout>
    );
}