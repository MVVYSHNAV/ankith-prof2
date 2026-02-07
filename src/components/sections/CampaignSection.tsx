import { motion, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const campaignStats = [
    { label: "Campaigns", value: "50+" },
    { label: "Brands", value: "20+" },
    { label: "Years Exp", value: "5+" },
    { label: "Magazines", value: "15+" }
];

const AnimatedCounter = ({ value, label }: { value: string; label: string }) => {
    // Extract number from string (e.g. "50K+" -> 50)
    const numberValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
    const suffix = value.replace(/[0-9]/g, "");

    return (
        <div className="text-center group hover:bg-secondary/20 p-6 rounded-lg transition-colors border border-transparent hover:border-border/40">
            <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="block font-display text-4xl md:text-5xl lg:text-6xl text-foreground group-hover:scale-110 transition-transform duration-500"
            >
                <Counter from={0} to={numberValue} duration={2} />{suffix}
            </motion.span>
            <span className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2 block">
                {label}
            </span>
        </div>
    );
};

const Counter = ({ from, to, duration }: { from: number; to: number; duration: number }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const controls = animate(from, to, {
            duration,
            onUpdate(value) {
                node.textContent = Math.round(value).toString();
            },
            ease: "easeOut"
        });

        return () => controls.stop();
    }, [from, to, duration]);

    return <span ref={nodeRef} />;
};

const CampaignSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    // Removed unused useInView hook here since AnimatedCounter handles visibility now, 
    // or we can keep it for the header if we want to animate that too.

    return (
        <section id="campaign" ref={sectionRef} className="py-24 bg-background border-t border-border">
            <div className="section-padding">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <span className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground">
                        Impact
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl mt-4">
                        By The <span className="italic font-editorial">Numbers</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {campaignStats.map((stat, i) => (
                        <div key={i} className="flex justify-center w-full">
                            <AnimatedCounter value={stat.value} label={stat.label} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CampaignSection;
