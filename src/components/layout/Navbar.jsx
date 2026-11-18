import { Link } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import Button from "../common/Button";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b border-sand bg-cream/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
                <Link to="/" className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-sage text-white">
                        <HeartHandshake size={20} />
                    </span>
                    <span className="font-heading text-xl font-extrabold text-ink">Baant</span>
                </Link>

                <div className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
                    <a href="#how" className="hover:text-ink">Kaise kaam karta hai</a>
                    <a href="#impact" className="hover:text-ink">Impact</a>
                </div>

                <div className="flex items-center gap-2">
                    <Link to="/login"><Button variant="outline">Login</Button></Link>
                    <Link to="/register" className="hidden sm:block"><Button>Join karo</Button></Link>
                </div>
            </div>
        </nav>
    );
}