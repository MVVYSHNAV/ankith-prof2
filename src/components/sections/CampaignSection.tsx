import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useProfile } from "@/hooks/useSupabase";
import OptimizedImage from "@/components/ui/OptimizedImage";

const CampaignSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const { data: profile } = useProfile();

    const highlightImage = profile?.career_highlight_image || "";

    return (
        <section id="career" ref={sectionRef} className="py-24 md:py-40 bg-background text-foreground overflow-hidden">
            <div className="max-w-[1920px] mx-auto px-0">
                <div className="relative">
                    {/* Image Container with Brand Gradient Overlay */}
                    <div className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden">
                        <motion.div
                            initial={{ scale: 1.1 }}
                            animate={isInView ? { scale: 1 } : {}}
                            transition={{ duration: 1.8, ease: "easeOut" }}
                            className="w-full h-full"
                        >
                            <OptimizedImage
                                src={highlightImage}
                                alt="Ankith Madhav Career Highlight"
                                className="w-full h-full object-cover"
                            />
                            {/* Sophisticated gradient overlay tied to brand colors */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-primary/80" />
                            <div className="absolute inset-0 bg-black/10" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CampaignSection;
