import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({ label, icon: Icon, type = "text", error, ...props }) {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";

    return (
        <div>
            <label className="mb-1.5 block text-sm font-semibold">{label}</label>
            <div className="relative">
                {Icon && <Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />}
                <input
                    type={isPassword && show ? "text" : type}
                    className={`w-full rounded-xl border bg-white py-3 pr-11 text-sm outline-none transition focus:ring-4 ${Icon ? "pl-11" : "pl-4"
                        } ${error
                            ? "border-red-300 focus:ring-red-100"
                            : "border-sand focus:border-sage focus:ring-mint"
                        }`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                    >
                        {show ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}