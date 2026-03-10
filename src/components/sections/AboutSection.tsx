import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/useSupabase";

const AboutSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const { data: profile } = useProfile();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    const image = profile?.avatar_url || "";
    const quote = profile?.about_bio || "";
    const highlightTitle = profile?.about_quote || "The Panache Factor";
    const fullBio = (profile?.about_full_bio || "").split('\n\n').filter(p => p.trim());

    return (
        <section id="about" ref={containerRef} className="py-32 md:py-40 section-padding bg-primary text-white transition-colors duration-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-32">
                {/* Image */}
                <div className="w-full md:w-1/2 relative">
                    <motion.div style={{ y }} className="relative z-10 overflow-hidden">
                        <img
                            src={image}
                            alt="Ankith Madhav Portrait"
                            className="w-full aspect-[3/4] object-cover transition-all duration-700"
                        />
                    </motion.div>
                    <div className="absolute top-10 -left-10 w-full h-full border border-white/10 -z-10 hidden md:block" />
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 space-y-8">
                    <div>
                        <span className="font-body text-xs tracking-[0.4em] uppercase text-white/70">
                            About
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.05em] uppercase mt-4 leading-tight text-white">
                            <br />
                            <span className="font-editorial italic normal-case tracking-wide">
                                {highlightTitle}
                            </span>
                        </h2>
                    </div>

                    <div className="space-y-6 font-editorial text-2xl md:text-2xl text-white leading-relaxed group">
                        <p className="font-body text-lg md:text-lg text-white/80 tracking-wide leading-relaxed max-w-xl">
                            {quote}
                        </p>

                        {!isExpanded && (
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="font-body text-base tracking-[0.3em] uppercase text-accent hover:text-white border-b border-accent hover:border-white pb-1 transition-all duration-300 mt-2"
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
                                <div className="space-y-4 font-body text-lg md:text-lg text-white/80 tracking-wide leading-relaxed pt-4 border-t border-white/10">
                                    {fullBio.map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))}
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="font-body text-sm tracking-[0.3em] uppercase text-white/40 hover:text-white pt-4 transition-colors"
                                    >
                                        Show Less
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6 border-t border-white/10 mt-8">
                        {[
                            { label: "Born", value: profile?.born || "" },
                            { label: "Height", value: profile?.height || "" },
                            { label: "Eye Color", value: profile?.eye_color || "" },
                            { label: "Hair Color", value: profile?.hair_color || "" },
                            { label: "Languages", value: profile?.languages || "" },
                        ].map((stat, idx) => (
                            <div key={idx} className="space-y-1">
                                <span className="block font-display text-xl mb-1 text-white">
                                    {stat.value}
                                </span>
                                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/60">
                                    {stat.label}
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
