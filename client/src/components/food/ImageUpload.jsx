import { useRef } from "react";
import { Camera, X } from "lucide-react";

export default function ImageUpload({ preview, onChange, onClear, error }) {
    const ref = useRef(null);

    return (
        <div>
            <label className="mb-1.5 block text-sm font-semibold">Khane ki photo</label>
            {preview ? (
                <div className="relative overflow-hidden rounded-2xl border border-sand">
                    <img src={preview} alt="preview" className="h-52 w-full object-cover" />
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white shadow"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => ref.current.click()}
                    className={`flex h-52 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-white text-muted transition hover:border-sage hover:bg-mint/40 ${error ? "border-red-300" : "border-sand"
                        }`}
                >
                    <Camera size={28} />
                    <span className="text-sm font-medium">Photo upload karo</span>
                    <span className="text-xs">JPG ya PNG, 5MB tak</span>
                </button>
            )}
            <input ref={ref} type="file" accept="image/*" onChange={onChange} className="hidden" />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}