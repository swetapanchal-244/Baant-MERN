import { NavLink, Link } from "react-router-dom";
import { HeartHandshake, LayoutDashboard, PlusCircle, LogOut } from "lucide-react";

const links = [
    { to: "/donor", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/donor/add", label: "Naya khana", icon: PlusCircle },
];

const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-mint text-sage-dark" : "text-muted hover:bg-cream hover:text-ink"
    }`;

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen lg:flex">
            {/* Desktop sidebar */}
            <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sand bg-white p-5 lg:flex">
                <Link to="/" className="mb-8 flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-sage text-white">
                        <HeartHandshake size={20} />
                    </span>
                    <span className="font-heading text-xl font-extrabold">Baant</span>
                </Link>

                <nav className="space-y-1">
                    {links.map((l) => (
                        <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                            <l.icon size={18} /> {l.label}
                        </NavLink>
                    ))}
                </nav>

                <Link to="/" className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted hover:bg-cream">
                    <LogOut size={18} /> Logout
                </Link>
            </aside>

            <main className="flex-1 px-5 pb-28 pt-8 lg:px-10 lg:pb-10">
                <div className="mx-auto max-w-4xl">{children}</div>
            </main>

            {/* Mobile bottom bar */}
            <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-sand bg-white/90 p-2 backdrop-blur lg:hidden">
                {links.map((l) => (
                    <NavLink
                        key={l.to}
                        to={l.to}
                        end={l.end}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 rounded-xl px-6 py-2 text-xs font-semibold ${isActive ? "bg-mint text-sage-dark" : "text-muted"
                            }`
                        }
                    >
                        <l.icon size={20} /> {l.label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}