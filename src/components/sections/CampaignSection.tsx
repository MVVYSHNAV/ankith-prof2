import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useProfile } from "@/hooks/useSupabase";
import { careerData as staticCareerData } from "@/data/career";

const CampaignSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const { data: profile } = useProfile();

    const highlightImage = profile?.career_highlight_image || staticCareerData.highlightImage;

    return (
        <section id="career" ref={sectionRef} className="py-24 md:py-40 bg-background text-foreground overflow-hidden">
            <div className="max-w-[1920px] mx-auto px-0">
                <div className="relative">
                    {/* Text Overlay */}
                    {/* <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center pointer-events-none text-white px-4">
                        <motion.h2
                            initial={{ y: 50, opacity: 0 }}
                            animate={isInView ? { y: 0, opacity: 1 } : {}}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="font-display text-5xl md:text-8xl lg:text-9xl uppercase tracking-[0.1em] text-gradient-gold drop-shadow-2xl"
                        >
                            Career
                        </motion.h2>
                    </div> */}

                    {/* Image Container with Brand Gradient Overlay */}
                    <div className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden">
                        <motion.div
                            initial={{ scale: 1.1 }}
                            animate={isInView ? { scale: 1 } : {}}
                            transition={{ duration: 1.8, ease: "easeOut" }}
                            className="w-full h-full"
                        >
                            <img
                                src={highlightImage}
                                alt="Ankith Madhav Career Highlight"
                                className="w-full h-full object-cover"
                            />
                            {/* Sophisticated gradient overlay tied to brand colors */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-primary/80" />
                            <div className="absolute inset-0 bg-black/10" />
                        </motion.div>
                    </div>

                    {/* Enhanced Scrolling ticker */}
                    {/* <div className="absolute bottom-0 left-0 w-full z-20 bg-primary/90 backdrop-blur-md border-y border-accent/20 py-8 overflow-hidden whitespace-nowrap">
                        <motion.div
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                            className="flex gap-20 font-display text-xs md:text-sm tracking-[0.4em] uppercase text-accent/80"
                        >
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex gap-20">
                                    {careers.map((career, idx) => (
                                        <div key={`${i}-${idx}`} className="flex items-center gap-20">
                                            <span>{career}</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </motion.div>
                    </div> */}
                </div>
            </div>
        </section>
    );
};

export default CampaignSection;
