import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { UtensilsCrossed, MapPin, Navigation, CheckCircle2, Loader2 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import ImageUpload from "../../components/food/ImageUpload";
import QuantityStepper from "../../components/food/QuantityStepper";
import useGeolocation from "../../hooks/useGeolocation";
import { addHours, toLocalInput } from "../../utils/formatTime";
import { createFood } from "../../services/foodService";
import { getError } from "../../services/api";

const chips = [1, 2, 4, 6];

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

export default function AddFood() {
    const [form, setForm] = useState({ title: "", description: "", address: "", expiryTime: "" });
    const [quantity, setQuantity] = useState(10);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");
    const { coords, loading, error: geoError, detect } = useGeolocation();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setErrors({ ...errors, image: "Photo 5MB se choti honi chahiye" });
            return;
        }
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setErrors({ ...errors, image: "" });
    };

    const clearImage = () => {
        setImage(null);
        setPreview("");
    };

    const validate = () => {
        const err = {};
        if (form.title.trim().length < 3) err.title = "Khane ka naam daalo";
        if (!image) err.image = "Ek photo zaroor daalo";
        if (!form.expiryTime) err.expiryTime = "Expiry time chuno";
        else if (new Date(form.expiryTime) <= new Date()) err.expiryTime = "Time future ka hona chahiye";
        if (form.address.trim().length < 5) err.address = "Pickup address daalo";
        if (!coords) err.location = "Location detect karo taaki NGO aap tak pahunch sake";
        return err;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        setErrors(err);
        if (Object.keys(err).length > 0) return;

        setSubmitting(true);
        setApiError("");
        try {
            await createFood({
                title: form.title,
                description: form.description,
                image: await toBase64(image),
                quantity,
                expiryTime: new Date(form.expiryTime).toISOString(),
                address: form.address,
                lat: coords.lat,
                lng: coords.lng,
            });
            setSuccess(true);
        } catch (error) {
            setApiError(getError(error));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-extrabold">Naya khana post karo</h1>
            <p className="mb-8 mt-1 text-muted">Bas 30 second, aur aaspaas ke NGO ko khana dikhne lagega.</p>

            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div
                        key="done"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-3xl border border-sand bg-white p-10 text-center"
                    >
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-mint text-sage"
                        >
                            <CheckCircle2 size={44} />
                        </motion.span>
                        <h2 className="text-2xl font-extrabold">Post ho gaya!</h2>
                        <p className="mx-auto mb-6 mt-2 max-w-sm text-muted">
                            NGO ko ab ye post dikhne lagi hai.
                        </p>
                        <Link to="/donor"><Button>Dashboard par jao</Button></Link>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 rounded-3xl border border-sand bg-white p-6 sm:p-8"
                    >
                        <Input label="Khane ka naam" icon={UtensilsCrossed} name="title"
                            placeholder="Jaise: Dal chawal aur sabzi" value={form.title}
                            onChange={handleChange} error={errors.title} />

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold">Details (optional)</label>
                            <textarea
                                name="description"
                                rows={3}
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Veg ya non-veg, kab bana, packing kaisi hai..."
                                className="w-full rounded-xl border border-sand bg-white p-4 text-sm outline-none transition focus:border-sage focus:ring-4 focus:ring-mint"
                            />
                        </div>

                        <ImageUpload preview={preview} onChange={handleImage} onClear={clearImage} error={errors.image} />

                        <QuantityStepper value={quantity} onChange={setQuantity} />

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold">Kab tak kha sakte hain?</label>
                            <div className="mb-3 flex flex-wrap gap-2">
                                {chips.map((h) => (
                                    <button
                                        key={h}
                                        type="button"
                                        onClick={() => {
                                            setForm({ ...form, expiryTime: toLocalInput(addHours(h)) });
                                            setErrors({ ...errors, expiryTime: "" });
                                        }}
                                        className="rounded-full bg-mint px-4 py-1.5 text-xs font-semibold text-sage-dark transition hover:bg-sage hover:text-white"
                                    >
                                        {h} ghante me
                                    </button>
                                ))}
                            </div>
                            <input
                                type="datetime-local"
                                name="expiryTime"
                                value={form.expiryTime}
                                onChange={handleChange}
                                className={`w-full rounded-xl border bg-white p-3 text-sm outline-none focus:ring-4 ${errors.expiryTime ? "border-red-300 focus:ring-red-100" : "border-sand focus:border-sage focus:ring-mint"
                                    }`}
                            />
                            {errors.expiryTime && <p className="mt-1 text-xs text-red-500">{errors.expiryTime}</p>}
                        </div>

                        <Input label="Pickup address" icon={MapPin} name="address"
                            placeholder="Ghar/hall ka pata, landmark ke saath" value={form.address}
                            onChange={handleChange} error={errors.address} />

                        <div>
                            <button
                                type="button"
                                onClick={detect}
                                disabled={loading}
                                className="flex items-center gap-2 rounded-xl border border-sage bg-mint/50 px-4 py-3 text-sm font-semibold text-sage-dark transition hover:bg-mint"
                            >
                                {loading ? <Loader2 size={17} className="animate-spin" /> : <Navigation size={17} />}
                                {coords ? "Location mil gayi, dobara detect karo" : "Meri location detect karo"}
                            </button>
                            {coords && (
                                <p className="mt-2 text-xs text-sage-dark">
                                    ✓ Lat {coords.lat.toFixed(4)}, Lng {coords.lng.toFixed(4)}
                                </p>
                            )}
                            {(geoError || errors.location) && (
                                <p className="mt-2 text-xs text-red-500">{geoError || errors.location}</p>
                            )}
                        </div>

                        {apiError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{apiError}</p>}

                        <Button type="submit" disabled={submitting} className="w-full py-3.5 text-base">
                            {submitting ? "Post ho raha hai..." : "Khana post karo"}
                        </Button>
                    </motion.form>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}