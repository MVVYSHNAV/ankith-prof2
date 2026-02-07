import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const AboutSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section id="about" ref={containerRef} className="py-32 md:py-40 section-padding">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-32">
                {/* Image */}
                <div className="w-full md:w-1/2 relative">
                    <motion.div style={{ y }} className="relative z-10 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2400"
                            alt="Ankith Madhav Portrait"
                            className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </motion.div>
                    <div className="absolute top-10 -left-10 w-full h-full border border-foreground/10 -z-10 hidden md:block" />
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 space-y-8">
                    <div>
                        <span className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground">
                            About
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.05em] uppercase mt-4 leading-tight">
                            Bold <br />
                            <span className="font-editorial italic normal-case tracking-wide">
                                Charisma
                            </span>
                        </h2>
                    </div>

                    <div className="space-y-6 font-editorial text-lg md:text-xl text-foreground/80 leading-relaxed group">
                        <p>
                            “I’m all about nailing impressions.”
                        </p>
                        <p className="font-body text-sm md:text-base text-muted-foreground tracking-wide leading-relaxed max-w-md">
                            [Biography to be added]
                        </p>
                    </div>

                    <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6">
                        <div>
                            <span className="block font-display text-xl mb-1">6'0"</span>
                            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Height</span>
                        </div>
                        <div>
                            <span className="block font-display text-xl mb-1">40"</span>
                            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Chest</span>
                        </div>
                        <div>
                            <span className="block font-display text-xl mb-1">32"</span>
                            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Waist</span>
                        </div>
                        <div>
                            <span className="block font-display text-xl mb-1">38"</span>
                            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Hips</span>
                        </div>
                        <div>
                            <span className="block font-display text-xl mb-1">9 UK</span>
                            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Shoe</span>
                        </div>
                        <div>
                            <span className="block font-display text-xl mb-1">Black</span>
                            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Hair</span>
                        </div>
                        <div>
                            <span className="block font-display text-xl mb-1">Brown</span>
                            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Eyes</span>
                        </div>
                        <div>
                            <span className="block font-display text-xl mb-1">UK</span>
                            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Location</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <span className="block font-display text-xl mb-1">En, Hi</span>
                            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Languages</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
