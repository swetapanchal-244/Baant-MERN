import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth, homeFor } from "../context/AuthContext";
import { getError } from "../services/api";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const onGoogle = async (res) => {
        try {
            const user = await googleLogin(res.credential);
            navigate(homeFor(user.role), { replace: true });
        } catch (error) {
            setErrors({ password: getError(error) });
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        setErrors(err);
        if (Object.keys(err).length > 0) return;

        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            navigate(homeFor(user.role), { replace: true });
        } catch (error) {
            setErrors({ password: getError(error) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Wapas aaye, swagat hai" subtitle="Apne account me login karo">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Email" icon={Mail} type="email" name="email" placeholder="aap@example.com"
                    value={form.email} onChange={handleChange} error={errors.email} />
                <Input label="Password" icon={Lock} type="password" name="password" placeholder="••••••••"
                    value={form.password} onChange={handleChange} error={errors.password} />

                <Button type="submit" disabled={loading} className="w-full py-3">
                    {loading ? "Ruko..." : "Login karo"}
                </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs text-muted">
                <span className="h-px flex-1 bg-sand" /> ya <span className="h-px flex-1 bg-sand" />
            </div>
            <div className="flex justify-center">
                <GoogleLogin onSuccess={onGoogle} onError={() => setErrors({ password: "Google login fail ho gaya" })} />
            </div>

            <p className="mt-6 text-center text-sm text-muted">
                Naye ho?{" "}
                <Link to="/register" className="font-semibold text-sage-dark hover:underline">Account banao</Link>
            </p>
        </AuthLayout>
    );
}