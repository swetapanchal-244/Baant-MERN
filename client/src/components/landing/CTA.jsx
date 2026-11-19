import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "../common/Reveal";
import Button from "../common/Button";

export default function CTA() {
    return (
        <section className="mx-auto max-w-4xl px-5 pb-24 text-center">
            <Reveal>
                <h2 className="mb-4 text-4xl font-extrabold">Aaj ek thaali kisi ke naam</h2>
                <p className="mx-auto mb-8 max-w-md text-muted">
                    Ek chhoti si post kisi ka pura din badal sakti hai. Abhi judo.
                </p>
                <Link to="/register">
                    <Button className="inline-flex items-center gap-2 px-8 py-3.5 text-base">
                        Shuru karo <ArrowRight size={18} />
                    </Button>
                </Link>
            </Reveal>
        </section>
    );
}