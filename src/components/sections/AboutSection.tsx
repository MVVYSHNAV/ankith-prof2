import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

import { aboutData } from "@/data/about";
import resumeData from "@/data/resume.json";

const AboutSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const { image, quote, bio } = aboutData;

    return (
        <section id="about" ref={containerRef} className="py-32 md:py-40 section-padding">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-32">
                {/* Image */}
                <div className="w-full md:w-1/2 relative">
                    <motion.div style={{ y }} className="relative z-10 overflow-hidden">
                        <img
                            src={image}
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
                            {quote}
                        </p>
                        <p className="font-body text-sm md:text-base text-muted-foreground tracking-wide leading-relaxed max-w-md">
                            {bio}
                        </p>

                        {!isExpanded && (
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="font-body text-xs tracking-[0.3em] uppercase text-accent hover:text-foreground border-b border-accent hover:border-foreground pb-1 transition-all duration-300 mt-2"
                            >
                                Know More
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.5 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-4 font-body text-sm md:text-base text-muted-foreground tracking-wide leading-relaxed pt-4 border-t border-border/50">
                                    {/* Type guard to ensure fullBio is treated as an array if it exists */}
                                    {Array.isArray(aboutData.fullBio) ? aboutData.fullBio.map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    )) : null}
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground pt-4 transition-colors"
                                    >
                                        Show Less
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6 border-t border-border/50 mt-8">
                        {Object.entries(resumeData.personalDetails).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                                <span className="block font-display text-xl mb-1">
                                    {Array.isArray(value) ? value.join(", ") : value}
                                </span>
                                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
