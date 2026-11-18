import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { User, Mail, Lock, Phone, Building2 } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import RoleSelector from "../components/auth/RoleSelector";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Register() {
    const [role, setRole] = useState("donor");
    const [form, setForm] = useState({ name: "", email: "", phone: "", orgName: "", password: "" });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const err = {};
        if (form.name.trim().length < 2) err.name = "Naam daalo";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Sahi email daalo";
        if (!/^[6-9]\d{9}$/.test(form.phone)) err.phone = "10 digit ka sahi mobile number daalo";
        if (role === "ngo" && form.orgName.trim().length < 2) err.orgName = "NGO ka naam daalo";
        if (form.password.length < 6) err.password = "Password kam se kam 6 characters ka ho";
        return err;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const err = validate();
        setErrors(err);
        if (Object.keys(err).length === 0) {
            setSuccess(true); // backend baad me judega
            console.log("Register data:", { ...form, role });
        }
    };

    return (
        <AuthLayout title="Account banao" subtitle="Baant se judo aur khana baanto">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="mb-1.5 block text-sm font-semibold">Aap kaun hain?</label>
                    <RoleSelector value={role} onChange={setRole} />
                </div>

                <Input label="Aapka naam" icon={User} name="name" placeholder="Sweta Sharma"
                    value={form.name} onChange={handleChange} error={errors.name} />

                <AnimatePresence>
                    {role === "ngo" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <Input label="NGO ka naam" icon={Building2} name="orgName" placeholder="Hope Foundation"
                                value={form.orgName} onChange={handleChange} error={errors.orgName} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <Input label="Email" icon={Mail} type="email" name="email" placeholder="aap@example.com"
                    value={form.email} onChange={handleChange} error={errors.email} />
                <Input label="Mobile number" icon={Phone} name="phone" placeholder="9876543210" maxLength={10}
                    value={form.phone} onChange={handleChange} error={errors.phone} />
                <Input label="Password" icon={Lock} type="password" name="password" placeholder="Kam se kam 6 characters"
                    value={form.password} onChange={handleChange} error={errors.password} />

                <Button type="submit" className="w-full py-3">Account banao</Button>

                {success && (
                    <p className="rounded-xl bg-mint p-3 text-center text-sm font-medium text-sage-dark">
                        Validation pass ho gaya. Backend jodne ke baad asli registration chalega.
                    </p>
                )}
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                Pehle se account hai?{" "}
                <Link to="/login" className="font-semibold text-sage-dark hover:underline">Login karo</Link>
            </p>
        </AuthLayout>
    );
}