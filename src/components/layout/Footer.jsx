import { HeartHandshake } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-sand bg-white">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
                <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-sage text-white">
                        <HeartHandshake size={16} />
                    </span>
                    <span className="font-heading font-bold">Baant</span>
                </div>
                <p className="text-sm text-muted">Khana baanto, khushiyan badhao. Made with care in India.</p>
                <p className="text-sm text-muted">© 2026 Baant</p>
            </div>
        </footer>
    );
}