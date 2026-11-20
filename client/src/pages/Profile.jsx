import { useEffect, useState } from "react";
import { User, Phone, Mail, Building2, Lock, BadgeCheck, Clock } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { getMe, updateProfile, changePassword } from "../services/profileService";
import { getMyFood } from "../services/foodService";
import { getNgoStats } from "../services/statsService";
import { getError } from "../services/api";

export default function Profile() {
    const { updateUser } = useAuth();
    const [me, setMe] = useState(null);
    const [form, setForm] = useState({ name: "", phone: "", orgName: "" });
    const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
    const [errors, setErrors] = useState({});
    const [stats, setStats] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getMe().then((u) => {
            setMe(u);
            setForm({ name: u.name, phone: u.phone, orgName: u.orgName || "" });
            updateUser(u);
            if (u.role === "donor") {
                getMyFood().then((list) =>
                    setStats({
                        a: list.length,
                        aLabel: "Total donations",
                        b: list.reduce((s, d) => s + d.quantity, 0),
                        bLabel: "Meals diye",
                    })
                );
            } else if (u.role === "ngo") {
                getNgoStats().then((s) =>
                    setStats({ a: s.pickups, aLabel: "Pickups complete", b: s.meals, bLabel: "Meals deliver kiye" })
                );
            }
        });
    }, []);

    const handle = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const saveProfile = async (e) => {
        e.preventDefault();
        const err = {};
        if (form.name.trim().length < 2) err.name = "Naam daalo";
        if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) err.phone = "10 digit ka sahi mobile number daalo";
        if (me.role === "ngo" && form.orgName.trim().length < 2) err.orgName = "NGO ka naam daalo";
        setErrors(err);
        if (Object.keys(err).length) return;

        setSaving(true);
        try {
            const updated = await updateProfile(form);
            setMe(updated);
            updateUser(updated);
            toast.success("Profile update ho gaya");
        } catch (error) {
            toast.error(getError(error));
        } finally {
            setSaving(false);
        }
    };

    const savePassword = async (e) => {
        e.preventDefault();
        if (pw.newPassword.length < 6) {
            setErrors({ newPassword: "Kam se kam 6 characters" });
            return;
        }
        try {
            await changePassword(pw);
            setPw({ currentPassword: "", newPassword: "" });
            setErrors({});
            toast.success("Password badal gaya");
        } catch (error) {
            setErrors({ currentPassword: getError(error) });
        }
    };

    if (!me) return <DashboardLayout><p className="text-muted">Load ho raha hai...</p></DashboardLayout>;

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-extrabold">Meri profile</h1>
            <p className="mb-8 mt-1 text-muted">Apni jaankari yahan dekho aur badlo.</p>

            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-3xl border border-sand bg-white p-6">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-sage font-heading text-2xl font-extrabold text-white">
                    {me.name[0]?.toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-xl font-bold">{me.name}</h2>
                    <p className="text-sm capitalize text-muted">
                        {me.role === "ngo" ? me.orgName : me.role} • Member since{" "}
                        {new Date(me.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </p>
                </div>
                {me.role === "ngo" && (
                    <span
                        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold ${me.isVerified ? "bg-mint text-sage-dark" : "bg-peach-soft text-peach"
                            }`}
                    >
                        {me.isVerified ? <BadgeCheck size={15} /> : <Clock size={15} />}
                        {me.isVerified ? "Verified NGO" : "Verification pending"}
                    </span>
                )}
            </div>

            {stats && (
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-sand bg-white p-5">
                        <p className="font-heading text-3xl font-extrabold">{stats.a}</p>
                        <p className="text-sm text-muted">{stats.aLabel}</p>
                    </div>
                    <div className="rounded-3xl border border-sand bg-white p-5">
                        <p className="font-heading text-3xl font-extrabold">{stats.b}</p>
                        <p className="text-sm text-muted">{stats.bLabel}</p>
                    </div>
                </div>
            )}

            {me.role === "ngo" && !me.isVerified && (
                <p className="mb-6 rounded-2xl bg-peach-soft p-4 text-sm text-peach">
                    Jab tak admin aapko verify nahi karta, aap khana accept nahi kar sakte.
                </p>
            )}

            <form onSubmit={saveProfile} className="mb-6 space-y-5 rounded-3xl border border-sand bg-white p-6">
                <h3 className="text-lg font-bold">Basic info</h3>
                <Input label="Naam" icon={User} name="name" value={form.name} onChange={handle} error={errors.name} />
                {me.role === "ngo" && (
                    <Input label="NGO ka naam" icon={Building2} name="orgName" value={form.orgName}
                        onChange={handle} error={errors.orgName} />
                )}
                <Input label="Email (badal nahi sakte)" icon={Mail} value={me.email} disabled readOnly />
                <Input label="Mobile number" icon={Phone} name="phone" maxLength={10} value={form.phone}
                    onChange={handle} error={errors.phone} />
                <Button type="submit" disabled={saving}>{saving ? "Save ho raha hai..." : "Save karo"}</Button>
            </form>

            {!me.isGoogleUser && (
                <form onSubmit={savePassword} className="space-y-5 rounded-3xl border border-sand bg-white p-6">
                    <h3 className="text-lg font-bold">Password badlo</h3>
                    <Input label="Purana password" icon={Lock} type="password" value={pw.currentPassword}
                        onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} error={errors.currentPassword} />
                    <Input label="Naya password" icon={Lock} type="password" value={pw.newPassword}
                        onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} error={errors.newPassword} />
                    <Button type="submit" variant="outline">Password badlo</Button>
                </form>
            )}
        </DashboardLayout>
    );
}