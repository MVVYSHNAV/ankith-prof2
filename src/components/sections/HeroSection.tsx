import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const HeroSection = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

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
    }, []);

    return (
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    ref={imageRef}
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop"
                    alt="Ankith Madhav - Fashion Model on Runway"
                    className="w-full h-full object-cover will-change-transform"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-background" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-28 section-padding">
                <div className="overflow-hidden">
                    <h1 className="hero-line font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-light tracking-[0.08em] uppercase text-foreground leading-[0.9]">
                        Ankith
                    </h1>
                </div>
                <div className="overflow-hidden mt-2">
                    <h1 className="hero-line font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-light tracking-[0.08em] uppercase text-foreground leading-[0.9]">
                        Madhav
                    </h1>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div className="max-w-md">
                        <p className="hero-subtitle font-editorial text-xl md:text-2xl text-foreground/90 italic tracking-wide mb-2">
                            "Man is genius when he is dreaming."
                        </p>
                        <p className="hero-subtitle font-body text-sm tracking-[0.2em] uppercase text-foreground/70">
                            Fashion & Commercial Model
                        </p>
                    </div>
                    <a
                        href="#contact"
                        className="hero-cta font-body text-xs tracking-[0.3em] uppercase text-foreground/80 hover:text-foreground border-b border-foreground/30 hover:border-foreground pb-2 transition-all duration-300 self-start sm:self-auto"
                    >
                        Contact Me
                    </a>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="w-px h-12 bg-white/50" />
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
