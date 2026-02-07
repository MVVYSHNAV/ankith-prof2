import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const projects = [
    { title: "Verisign Commercial", role: "Drama", duration: "01:06" },
    { title: ".com Awareness Campaign", role: "Commercial", duration: "Active" },
    { title: "Editorial Fashion Series", role: "Print", duration: "2024" },
    { title: "Independent Brand Campaigns", role: "Digital", duration: "Var." },
];

const PressSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section id="filmography" ref={sectionRef} className="py-32 md:py-40 section-padding bg-background">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="mb-16 md:mb-24"
                >
                    <span className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground">
                        Filmography
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-light tracking-[0.05em] uppercase mt-4">
                        Featured <span className="font-editorial italic normal-case tracking-wide">Project</span>
                    </h2>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                    {/* Project Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 space-y-8"
                    >
                        <div className="space-y-2">
                            <h3 className="font-display text-5xl md:text-7xl uppercase leading-none">
                                Verisign
                            </h3>
                            <div className="flex items-center gap-6 text-muted-foreground">
                                <span className="font-body text-sm tracking-[0.2em] uppercase">Drama</span>
                                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                                <span className="font-body text-sm tracking-[0.2em] uppercase">01:06</span>
                            </div>
                        </div>

                        <div className="space-y-6 max-w-md">
                            <p className="font-editorial text-xl md:text-2xl italic leading-relaxed text-foreground/80">
                                "Register karo apne business ka .com
                                Ek naam ke kayi business ho sakte hain
                                Sirf .com deta hai aapke business ko
                                ek alag pehchaan .com abhi, pehchaan tabhi."
                            </p>
                            <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                A powerful campaign emphasizing the unique identity a .com domain provides to businesses in a crowded market.
                            </p>
                        </div>

                        <div className="pt-8 flex items-center justify-between border-t border-border mt-auto">
                            <span className="font-body text-xs tracking-[0.2em] text-muted-foreground">01 / 29</span>
                            <div className="flex gap-8">
                                <button className="font-body text-xs tracking-[0.3em] uppercase hover:text-accent transition-colors">Prev</button>
                                <button className="font-body text-xs tracking-[0.3em] uppercase hover:text-accent transition-colors">Next</button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Project Visual/Preview Placeholders */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex-1 w-full aspect-video bg-secondary/50 relative overflow-hidden group"
                    >
                        {/* Placeholder for video/image */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">Project Preview</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PressSection;
