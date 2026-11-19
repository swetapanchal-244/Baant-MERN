import { useEffect, useState } from "react";
import Reveal from "../common/Reveal";
import Counter from "../common/Counter";
import { getPublicStats } from "../../services/statsService";

export default function Impact() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        getPublicStats().then(setStats).catch(() => setStats({ meals: 0, donors: 0, ngos: 0, areas: 0 }));
    }, []);

    const items = stats && [
        { to: stats.meals, label: "Meals bachaye" },
        { to: stats.donors, label: "Donors" },
        { to: stats.ngos, label: "Partner NGOs" },
        { to: stats.areas, label: "Areas covered" },
    ];

    return (
        <section id="impact" className="scroll-mt-20 mx-auto max-w-6xl px-5 pb-24">
            <Reveal>
                <div className="relative overflow-hidden rounded-[2.5rem] bg-sage px-8 py-16 text-center text-white">
                    <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-peach/30 blur-3xl" />
                    <h2 className="relative mb-12 text-4xl font-extrabold">Hamara ab tak ka asar</h2>
                    <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
                        {items
                            ? items.map((s) => (
                                <div key={s.label}>
                                    <p className="font-heading text-5xl font-extrabold">
                                        <Counter to={s.to} />
                                    </p>
                                    <p className="mt-2 text-sm text-white/80">{s.label}</p>
                                </div>
                            ))
                            : [0, 1, 2, 3].map((i) => (
                                <div key={i} className="mx-auto h-16 w-28 animate-pulse rounded-2xl bg-white/15" />
                            ))}
                    </div>
                </div>
            </Reveal>
        </section>
    );
}