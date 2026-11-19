import { motion } from "framer-motion";
import Counter from "../common/Counter";

export default function StatCard({ icon: Icon, label, value, tint }) {
    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="rounded-3xl border border-sand bg-white p-5"
        >
            <span className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl ${tint}`}>
                <Icon size={20} />
            </span>
            <p className="font-heading text-3xl font-extrabold">
                <Counter to={value} />
            </p>
            <p className="text-sm text-muted">{label}</p>
        </motion.div>
    );
}