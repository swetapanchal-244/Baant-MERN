import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HeartHandshake, Quote } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Left: decorative panel */}
            <div className="relative hidden overflow-hidden bg-sage p-12 text-white lg:flex lg:flex-col lg:justify-between">
                <div className="absolute -right-20 -top-20 h-80 w-80 animate-blob rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-24 -left-16 h-96 w-96 animate-blob rounded-full bg-peach/30 blur-3xl [animation-delay:-6s]" />

                <Link to="/" className="relative flex items-center gap-2">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/20">
                        <HeartHandshake size={22} />
                    </span>
                    <span className="font-heading text-2xl font-extrabold">Baant</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="relative"
                >
                    <Quote size={40} className="mb-4 text-white/40" />
                    <p className="font-heading text-3xl font-bold leading-snug">
                        Ek chhoti si post, kisi ka pura din badal sakti hai.
                    </p>
                    <p className="mt-4 text-white/70">Khana baanto, khushiyan badhao.</p>
                </motion.div>

                <p className="relative text-sm text-white/60">© 2026 Baant</p>
            </div>

            {/* Right: form */}
            <div className="flex items-center justify-center px-5 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-md"
                >
                    <h1 className="text-3xl font-extrabold">{title}</h1>
                    <p className="mb-8 mt-2 text-muted">{subtitle}</p>
                    {children}
                </motion.div>
            </div>
        </div>
    );
}