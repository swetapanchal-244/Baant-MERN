import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Bell, CheckCircle2, MapPin } from "lucide-react";
import Button from "../common/Button";

const words = ["Bacha", "khana,", "kisi", "ka", "bhojan."];

const float = (delay = 0) => ({
    animate: { y: [0, -14, 0] },
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay },
});

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute -left-24 -top-24 h-96 w-96 animate-blob rounded-full bg-mint blur-3xl" />
            <div className="absolute -right-24 top-40 h-96 w-96 animate-blob rounded-full bg-peach-soft blur-3xl [animation-delay:-7s]" />

            <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-16 lg:grid-cols-2 lg:py-24">
                <div>
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-1.5 text-xs font-semibold text-sage-dark"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
                        </span>
                        Real-time food donation network
                    </motion.span>

                    <h1 className="text-5xl font-extrabold leading-[1.1] sm:text-6xl">
                        {words.map((w, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                                className={`mr-3 inline-block ${i === 4 ? "bg-linear-to-r from-sage to-peach bg-clip-text text-transparent" : ""
                                    }`}
                            >
                                {w}
                            </motion.span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="mt-6 max-w-md text-lg text-muted"
                    >
                        Shadi, hostel mess ya ghar ka bacha hua khana, aaspaas ke NGO tak
                        seedha aur live. Koi dana waste nahi.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="mt-8 flex flex-wrap gap-3"
                    >
                        <Link to="/register">
                            <Button className="flex items-center gap-2 px-7 py-3">
                                Khana donate karo <ArrowRight size={16} />
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="peach" className="px-7 py-3">NGO ke roop me judo</Button>
                        </Link>
                    </motion.div>
                </div>

                <div className="relative mx-auto h-[420px] w-full max-w-md">
                    <motion.div {...float(0)} className="absolute left-0 top-4 w-72 rounded-2xl border border-sand bg-white/90 p-4 shadow-xl shadow-sage/10 backdrop-blur">
                        <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-peach-soft text-peach"><Bell size={18} /></span>
                            <div>
                                <p className="text-sm font-bold">Naya khana post hua</p>
                                <p className="text-xs text-muted">Shadi hall, 40 logon ka khana</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div {...float(1.2)} className="absolute right-0 top-36 w-72 rounded-2xl border border-sand bg-white/90 p-4 shadow-xl shadow-sage/10 backdrop-blur">
                        <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-sage-dark"><MapPin size={18} /></span>
                            <div>
                                <p className="text-sm font-bold">1.2 km door</p>
                                <p className="text-xs text-muted">Aapke sabse nazdeeki donor</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div {...float(2.4)} className="absolute bottom-4 left-6 w-72 rounded-2xl border border-sand bg-white/90 p-4 shadow-xl shadow-sage/10 backdrop-blur">
                        <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-sage-dark"><CheckCircle2 size={18} /></span>
                            <div>
                                <p className="text-sm font-bold">Pickup confirm ho gaya</p>
                                <p className="text-xs text-muted">Hope NGO • 15 min me pahunch rahe hain</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}