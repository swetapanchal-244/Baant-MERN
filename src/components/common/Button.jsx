export default function Button({ children, variant = "primary", className = "", ...props }) {
    const styles = {
        primary: "bg-sage text-white hover:bg-sage-dark",
        soft: "bg-mint text-sage-dark hover:bg-sage/20",
        peach: "bg-peach text-white hover:opacity-90",
        outline: "border border-sand bg-white text-ink hover:bg-mint",
    };
    return (
        <button
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${styles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}