import Hero from "../components/landing/Hero";
import Marquee from "../components/landing/Marquee";
import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";
import Impact from "../components/landing/Impact";
import CTA from "../components/landing/CTA";

export default function Landing() {
    return (
        <>
            <Hero />
            <Marquee />
            <HowItWorks />
            <Features />
            <Impact />
            <CTA />
        </>
    );
}