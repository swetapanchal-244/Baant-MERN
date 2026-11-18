import { Clock, MapPin, Users } from "lucide-react";
import Button from "../common/Button";

export default function FoodCard({ food }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-sand bg-white transition hover:shadow-lg hover:shadow-sage/10">
            <img src={food.image} alt={food.title} className="h-40 w-full object-cover" />
            <div className="space-y-3 p-4">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold">{food.title}</h3>
                    <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-sage-dark">
                        {food.status}
                    </span>
                </div>
                <div className="space-y-1.5 text-sm text-muted">
                    <p className="flex items-center gap-2"><Users size={15} /> {food.quantity} logon ka khana</p>
                    <p className="flex items-center gap-2"><MapPin size={15} /> {food.distance} door</p>
                    <p className="flex items-center gap-2 text-peach"><Clock size={15} /> {food.expiry} me expire</p>
                </div>
                <Button className="w-full">Accept karo</Button>
            </div>
        </div>
    );
}