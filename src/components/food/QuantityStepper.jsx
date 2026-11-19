import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ value, onChange }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-semibold">Kitne logon ka khana?</label>
            <div className="flex items-center gap-4 rounded-xl border border-sand bg-white p-2">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(1, value - 5))}
                    className="grid h-10 w-10 place-items-center rounded-lg bg-mint text-sage-dark transition hover:bg-sage hover:text-white"
                >
                    <Minus size={18} />
                </button>
                <span className="flex-1 text-center font-heading text-2xl font-extrabold">{value}</span>
                <button
                    type="button"
                    onClick={() => onChange(value + 5)}
                    className="grid h-10 w-10 place-items-center rounded-lg bg-mint text-sage-dark transition hover:bg-sage hover:text-white"
                >
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );
}