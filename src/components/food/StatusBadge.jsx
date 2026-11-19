const map = {
    available: { label: "Available", cls: "bg-mint text-sage-dark" },
    accepted: { label: "NGO ne accept kiya", cls: "bg-peach-soft text-peach" },
    picked: { label: "Pickup ho gaya", cls: "bg-amber-100 text-amber-700" },
    delivered: { label: "Deliver hua", cls: "bg-sage text-white" },
    expired: { label: "Expired", cls: "bg-gray-100 text-gray-500" },
};

export default function StatusBadge({ status }) {
    const s = map[status] || map.available;
    return (
        <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}>
            {s.label}
        </span>
    );
}