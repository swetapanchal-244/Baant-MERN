import { motion } from "framer-motion";
import { Utensils, HeartHandshake } from "lucide-react";

const roles = [
    { id: "donor", label: "Donor", sub: "Khana donate karo", icon: Utensils },
    { id: "ngo", label: "NGO", sub: "Khana receive karo", icon: HeartHandshake },
];

export default function RoleSelector({ value, onChange }) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {roles.map((r) => {
                const active = value === r.id;
                return (
                    <button
                        key={r.id}
                        type="button"
                        onClick={() => onChange(r.id)}
                        className="relative rounded-2xl border border-sand bg-white p-4 text-left"
                    >
                        {active && (
                            <motion.span
                                layoutId="role-active"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                className="absolute inset-0 rounded-2xl border-2 border-sage bg-mint"
                            />
                        )}
                        <span className="relative flex items-center gap-3">
                            <span className={`grid h-10 w-10 place-items-center rounded-xl transition ${active ? "bg-sage text-white" : "bg-cream text-muted"}`}>
                                <r.icon size={19} />
                            </span>
                            <span>
                                <span className="block text-sm font-bold">{r.label}</span>
                                <span className="block text-xs text-muted">{r.sub}</span>
                            </span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}