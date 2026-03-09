import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useProfile } from "@/hooks/useSupabase";
import heroImageDefault from "@/assets/images/6.jpeg";

const HeroSection = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const { data: profile } = useProfile();

    const heroTitle = profile?.hero_title || "Ankith";
    const heroSubtitle = profile?.hero_subtitle || "Madhav";
    const heroQuote = profile?.title_italic || '"Man is genius when he is dreaming."';
    const heroImage = profile?.hero_image_url || heroImageDefault;
    const heroRole = profile?.bio || "Actor";

    useEffect(() => {
        if (!imageRef.current) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (imageRef.current) {
                imageRef.current.style.transform = `scale(${1 + scrollY * 0.0003}) translateY(${scrollY * 0.3}px)`;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!heroRef.current) return;

        const tl = gsap.timeline({ delay: 0.3 });

        tl.from(".hero-line", {
            y: 120,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.15,
        })
            .from(".hero-subtitle", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            }, "-=0.4")
            .from(".hero-cta", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out",
            }, "-=0.3")
            .from(".hero-scroll", {
                opacity: 0,
                duration: 0.6,
                ease: "power3.out",
            }, "-=0.2");
    }, [profile]); // Re-run if profile data changes

    return (
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute top-[-7.5vh] left-0 w-full h-[115vh] overflow-hidden">
                <img
                    ref={imageRef}
                    src={heroImage}
                    alt={`${heroTitle} ${heroSubtitle} - Hero`}
                    className="w-full h-full object-cover object-[center_15%] will-change-transform"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-background/90" />
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end pb-12 md:pb-24 lg:pb-32 section-padding">
                <div className="flex flex-col lg:gap-2">
                    <div className="overflow-hidden">
                        <h1 className="hero-line font-display text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] 2xl:text-[16rem] font-light tracking-[-0.02em] uppercase text-white leading-[0.85] pr-2">
                            {heroTitle}
                        </h1>
                    </div>
                    <div className="overflow-hidden lg:pl-[10%] xl:pl-[12%]">
                        <h1 className="hero-line font-display text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] 2xl:text-[16rem] font-light tracking-[-0.02em] uppercase text-white leading-[0.85] pr-4">
                            {heroSubtitle}
                        </h1>
                    </div>
                </div>

                <div className="mt-10 lg:mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
                    <div className="max-w-md lg:max-w-lg">
                        <p className="hero-subtitle font-editorial text-2xl md:text-3xl lg:text-4xl text-white/90 italic tracking-tight mb-4 leading-tight">
                            {heroQuote}
                        </p>
                        <div className="h-px w-12 bg-accent/60 mb-4" />
                        <p className="hero-subtitle font-body text-xs lg:text-sm tracking-[0.3em] uppercase text-white/60">
                            {heroRole}
                        </p>
                    </div>
                    <a
                        href="#contact"
                        className="hero-cta group relative inline-flex items-center gap-4 py-2"
                    >
                        <span className="font-body text-xs lg:text-sm tracking-[0.4em] uppercase text-white/80 group-hover:text-white transition-colors duration-500">
                            Contact Me
                        </span>
                        <span className="w-8 lg:w-12 h-[1px] bg-white/30 group-hover:w-16 group-hover:bg-accent transition-all duration-500" />
                    </a>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-auto lg:right-12 lg:translate-x-0"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="flex flex-col items-center gap-4">
                        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/40 vertical-text hidden lg:block">
                            Scroll
                        </span>
                        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 w-full h-1/2 bg-accent"
                                animate={{ top: ["-50%", "100%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}} />
        </section>
    );
};

export default HeroSection;
