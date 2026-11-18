import { motion } from "framer-motion";
import { Zap, Map, Timer, ShieldCheck, BarChart3 } from "lucide-react";
import Reveal from "../common/Reveal";

const cards = [
    { icon: Zap, title: "Real-time alerts", text: "Socket.io se NGO ko khana post hote hi notification, bina refresh kiye.", span: "md:col-span-2", bg: "bg-mint" },
    { icon: Map, title: "Live map", text: "Nearby food map pe dikhta hai.", span: "", bg: "bg-white" },
    { icon: Timer, title: "Auto expire", text: "Purana khana apne aap hat jata hai, food safety pehle.", span: "", bg: "bg-peach-soft" },
    { icon: ShieldCheck, title: "Verified NGOs", text: "Sirf verified organizations hi pickup kar sakte hain, bharosa pehle.", span: "", bg: "bg-white" },
    { icon: BarChart3, title: "Impact dashboard", text: "Kitne meals bache, kitne logon tak pahunche, sab charts me.", span: "md:col-span-2", bg: "bg-mint" },
];

export default function Features() {
    return (
        <section id="features" className="mx-auto max-w-6xl px-5 pb-24">
            <Reveal className="mx-auto mb-14 max-w-xl text-center">
                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-sage">Features</p>
                <h2 className="text-4xl font-extrabold">Chhota idea, smart technology</h2>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-3">
                {cards.map((c, i) => (
                    <Reveal key={c.title} delay={i * 0.08} className={c.span}>
                        <motion.div
                            whileHover={{ scale: 1.02, rotate: -0.5 }}
                            transition={{ type: "spring", stiffness: 250 }}
                            className={`group h-full rounded-3xl border border-sand p-7 ${c.bg}`}
                        >
                            <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-sage text-white transition group-hover:rotate-12">
                                <c.icon size={22} />
                            </span>
                            <h3 className="mb-2 text-xl font-bold">{c.title}</h3>
                            <p className="text-muted">{c.text}</p>
                        </motion.div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}