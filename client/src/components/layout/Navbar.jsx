import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import Button from "../common/Button";
import { useAuth, homeFor } from "../../context/AuthContext";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuth();
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-sand bg-cream/70 shadow-sm backdrop-blur-xl" : "bg-transparent"
                }`}
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
                <Link to="/" className="flex items-center gap-2">
                    <motion.span
                        whileHover={{ rotate: -10, scale: 1.1 }}
                        className="grid h-9 w-9 place-items-center rounded-xl bg-sage text-white"
                    >
                        <HeartHandshake size={20} />
                    </motion.span>
                    <span className="font-heading text-xl font-extrabold text-ink">Baant</span>
                </Link>

                <div className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
                    <a href="#how" className="transition hover:text-ink">Kaise kaam karta hai</a>
                    <a href="#features" className="transition hover:text-ink">Features</a>
                    <a href="#impact" className="transition hover:text-ink">Impact</a>
                </div>

                <div className="flex items-center gap-2">
                    {user ? (
                        <Link to={homeFor(user.role)}><Button>Dashboard</Button></Link>
                    ) : (
                        <>
                            <Link to="/login"><Button variant="outline">Login</Button></Link>
                            <Link to="/register" className="hidden sm:block"><Button>Join karo</Button></Link>
                        </>
                    )}
                </div>
            </div>
            <motion.div style={{ scaleX: progress }} className="h-0.5 origin-left bg-linear-to-r from-sage to-peach" />
        </motion.nav>
    );
}