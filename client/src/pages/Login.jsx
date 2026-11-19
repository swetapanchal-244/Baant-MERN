import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const err = {};
        if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Sahi email daalo";
        if (form.password.length < 6) err.password = "Password kam se kam 6 characters ka ho";
        return err;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const err = validate();
        setErrors(err);
        if (Object.keys(err).length === 0) {
            setSuccess(true); // backend baad me judega
            console.log("Login data:", form);
        }
    };

    return (
        <AuthLayout title="Wapas aaye, swagat hai" subtitle="Apne account me login karo">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Email" icon={Mail} type="email" name="email" placeholder="aap@example.com"
                    value={form.email} onChange={handleChange} error={errors.email} />
                <Input label="Password" icon={Lock} type="password" name="password" placeholder="••••••••"
                    value={form.password} onChange={handleChange} error={errors.password} />

                <Button type="submit" className="w-full py-3">Login karo</Button>

                {success && (
                    <p className="rounded-xl bg-mint p-3 text-center text-sm font-medium text-sage-dark">
                        Validation pass ho gaya. Backend jodne ke baad asli login chalega.
                    </p>
                )}
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                Naye ho?{" "}
                <Link to="/register" className="font-semibold text-sage-dark hover:underline">Account banao</Link>
            </p>
        </AuthLayout>
    );
}