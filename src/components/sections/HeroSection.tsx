import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useRef } from "react";

const HeroSection = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    return (
        <section ref={ref} id="home" className="relative h-screen min-h-[800px] flex flex-col justify-center overflow-hidden bg-background">
            {/* Background Gradient/Image Placeholder */}
            <motion.div
                style={{ scale: scaleImg }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--secondary))_0%,transparent_40%)] -z-10"
            />
            <div className="absolute inset-0 z-0">
                <motion.img
                    style={{ scale: scaleImg }}
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop"
                    alt="Ankith Madhav - Fashion Model on Runway"
                    className="w-full h-full object-cover opacity-20 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>

            <div className="section-padding relative z-10 w-full">
                <div className="max-w-4xl">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-block font-body text-xs tracking-[0.4em] uppercase text-muted-foreground mb-6"
                    >
                        Portfolio & Campaign
                    </motion.span>

                    <motion.h1
                        style={{ y: yText, opacity: opacityText }}
                        className="font-display text-5xl md:text-7xl lg:text-9xl font-medium tracking-tight uppercase leading-[0.9] mb-8"
                    >
                        <span className="block overflow-hidden">
                            <motion.span
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
                                className="block"
                            >
                                Visionary
                            </motion.span>
                        </span>
                        <span className="block overflow-hidden text-muted-foreground">
                            <motion.span
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1, delay: 0.55, ease: [0.33, 1, 0.68, 1] }}
                                className="block"
                            >
                                Creation
                            </motion.span>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="font-editorial text-xl md:text-2xl text-foreground/80 max-w-lg mb-12 italic"
                    >
                        "Designing digital experiences that bridge the gap between functionality and art."
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="flex flex-wrap gap-6"
                    >
                        <MagneticButton strength={0.3}>
                            <a href="#portfolio" className="inline-block px-8 py-4 bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors">
                                View Work
                            </a>
                        </MagneticButton>

                        <MagneticButton strength={0.3}>
                            <a href="#contact" className="inline-block px-8 py-4 border border-border text-foreground font-body text-xs tracking-[0.2em] uppercase hover:bg-secondary transition-colors">
                                Contact Me
                            </a>
                        </MagneticButton>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
                <span className="font-body text-[10px] tracking-[0.3em] uppercase opacity-50">Scroll</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ArrowDown className="w-4 h-4 opacity-50" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
