const items = ["Shadi", "Hostel Mess", "Restaurant", "College Canteen", "Ghar ka khana", "Tiffin Service", "Party", "Catering"];

export default function Marquee() {
    const list = [...items, ...items];
    return (
        <div className="overflow-hidden border-y border-sand bg-white py-4">
            <div className="flex w-max animate-marquee gap-10">
                {list.map((item, i) => (
                    <span key={i} className="flex items-center gap-10 whitespace-nowrap text-sm font-semibold text-muted">
                        {item} <span className="text-peach">✦</span>
                    </span>
                ))}
            </div>
        </div>
    );
}