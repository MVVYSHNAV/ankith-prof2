import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { careerData } from "@/data/career";

const CampaignSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const { careers, timeline, highlightImage } = careerData;

    return (
        <section id="career" ref={sectionRef} className="py-32 md:py-40 bg-background text-foreground overflow-hidden">
            <div className="max-w-[1920px] mx-auto px-0">
                <div className="relative">
                    {/* Text Overlay */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center pointer-events-none mix-blend-difference text-white px-4">
                        <motion.h2
                            initial={{ y: 50, opacity: 0 }}
                            animate={isInView ? { y: 0, opacity: 1 } : {}}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="font-display text-5xl md:text-7xl lg:text-8xl uppercase tracking-widest"
                        >
                            Career
                        </motion.h2>
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={isInView ? { y: 0, opacity: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-6 flex flex-col gap-2 items-center"
                        >
                            <p className="font-editorial italic text-2xl md:text-3xl">
                                {timeline.startYear} — {timeline.endYear}
                            </p>
                        </motion.div>
                    </div>

                    {/* Image */}
                    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
                        <motion.div
                            initial={{ scale: 1.1 }}
                            animate={isInView ? { scale: 1 } : {}}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="w-full h-full"
                        >
                            <img
                                src={highlightImage}
                                alt="Ankith Madhav Career Highlight"
                                className="w-full h-full object-cover grayscale"
                            />
                            <div className="absolute inset-0 bg-black/40" />
                        </motion.div>
                    </div>

                    {/* Scrolling ticker */}
                    <div className="bg-foreground text-background py-6 overflow-hidden whitespace-nowrap">
                        <motion.div
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                            className="flex gap-16 font-display text-sm md:text-base tracking-[0.3em] uppercase"
                        >
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex gap-16">
                                    {careers.map((career, idx) => (
                                        <span key={`${i}-${idx}`}>
                                            {career}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CampaignSection;
