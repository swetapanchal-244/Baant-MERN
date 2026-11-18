import { motion } from "framer-motion";
import { Camera, BellRing, Truck } from "lucide-react";
import Reveal from "../common/Reveal";

const steps = [
    { icon: Camera, title: "Donor post karta hai", text: "Khane ki photo, quantity aur expiry time daalo. Bas 30 second.", tint: "bg-mint text-sage-dark" },
    { icon: BellRing, title: "NGO ko live alert", text: "Aaspaas ke verified NGO ko turant notification milta hai.", tint: "bg-peach-soft text-peach" },
    { icon: Truck, title: "Pickup aur delivery", text: "NGO accept karke khana uthata hai, status live track hota hai.", tint: "bg-mint text-sage-dark" },
];

export default function HowItWorks() {
    return (
        <section id="how" className="mx-auto max-w-6xl px-5 py-24">
            <Reveal className="mx-auto mb-14 max-w-xl text-center">
                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-sage">Kaise kaam karta hai</p>
                <h2 className="text-4xl font-extrabold">Teen simple steps, ek full thaali</h2>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-3">
                {steps.map((s, i) => (
                    <Reveal key={s.title} delay={i * 0.15}>
                        <motion.div
                            whileHover={{ y: -10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative h-full overflow-hidden rounded-3xl border border-sand bg-white p-7"
                        >
                            <span className="absolute right-5 top-2 font-heading text-7xl font-extrabold text-sand">{i + 1}</span>
                            <span className={`relative mb-5 grid h-12 w-12 place-items-center rounded-2xl ${s.tint}`}>
                                <s.icon size={22} />
                            </span>
                            <h3 className="relative mb-2 text-xl font-bold">{s.title}</h3>
                            <p className="relative text-muted">{s.text}</p>
                        </motion.div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}