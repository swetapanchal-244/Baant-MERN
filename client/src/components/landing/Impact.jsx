import Reveal from "../components/common/Reveal";
import Counter from "../components/common/Counter";

const stats = [
    { to: 1200, suffix: "+", label: "Meals bachaye" },
    { to: 45, suffix: "+", label: "Donors" },
    { to: 12, suffix: "", label: "Partner NGOs" },
    { to: 8, suffix: "", label: "Areas covered" },
];

export default function Impact() {
    return (
        <section id="impact" className="mx-auto max-w-6xl px-5 pb-24">
            <Reveal>
                <div className="relative overflow-hidden rounded-[2.5rem] bg-sage px-8 py-16 text-center text-white">
                    <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-peach/30 blur-3xl" />
                    <h2 className="relative mb-12 text-4xl font-extrabold">Hamara ab tak ka asar</h2>
                    <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((s) => (
                            <div key={s.label}>
                                <p className="font-heading text-5xl font-extrabold">
                                    <Counter to={s.to} suffix={s.suffix} />
                                </p>
                                <p className="mt-2 text-sm text-white/80">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Reveal>
        </section>
    );
}