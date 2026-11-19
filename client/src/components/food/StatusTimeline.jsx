import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
    { id: "available", label: "Posted" },
    { id: "accepted", label: "Accepted" },
    { id: "picked", label: "Picked up" },
    { id: "delivered", label: "Delivered" },
];

export default function StatusTimeline({ status }) {
    const current = steps.findIndex((s) => s.id === status);

    return (
        <div className="flex items-center">
            {steps.map((s, i) => {
                const done = i <= current;
                return (
                    <div key={s.id} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center gap-1.5">
                            <motion.span
                                animate={{ scale: i === current ? 1.15 : 1 }}
                                className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold transition-colors ${done ? "bg-sage text-white" : "bg-sand text-muted"
                                    }`}
                            >
                                {done ? <Check size={15} /> : i + 1}
                            </motion.span>
                            <span className={`text-[11px] font-semibold ${done ? "text-sage-dark" : "text-muted"}`}>
                                {s.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="mx-2 mb-5 h-1 flex-1 overflow-hidden rounded-full bg-sand">
                                <motion.div
                                    initial={false}
                                    animate={{ width: i < current ? "100%" : "0%" }}
                                    transition={{ duration: 0.6 }}
                                    className="h-full bg-sage"
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}