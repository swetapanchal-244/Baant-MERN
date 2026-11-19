import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function WeeklyChart({ data, title }) {
    return (
        <div className="rounded-3xl border border-sand bg-white p-5">
            <h3 className="mb-4 text-lg font-bold">{title}</h3>
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ECE7DC" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6B7A72", fontSize: 12 }} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#6B7A72", fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: "#E5F2EB" }}
                            contentStyle={{ borderRadius: 12, border: "1px solid #ECE7DC" }}
                            formatter={(v) => [`${v} meals`, ""]}
                        />
                        <Bar dataKey="meals" fill="#5B9A7E" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}