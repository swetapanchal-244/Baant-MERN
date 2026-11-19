import { motion } from "framer-motion";

export default function Button({ children, variant = "primary", className = "", ...props }) {
    const styles = {
        primary: "bg-sage text-white hover:bg-sage-dark shadow-lg shadow-sage/25",
        soft: "bg-mint text-sage-dark hover:bg-sage/20",
        peach: "bg-peach text-white hover:opacity-90 shadow-lg shadow-peach/30",
        outline: "border border-sand bg-white text-ink hover:bg-mint",
    };
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors duration-200 ${styles[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
}
