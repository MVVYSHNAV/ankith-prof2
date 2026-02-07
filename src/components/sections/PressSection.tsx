import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const pressArticles = [
    { outlet: "Vogue India", title: "The New Face of Digital Fashion", date: "Oct 2024", link: "#" },
    { outlet: "GQ Style", title: "Breaking Boundaries in Men's Editorial", date: "Sep 2024", link: "#" },
    { outlet: "Hypebeast", title: "Streetwear & High Fashion Collision", date: "Aug 2024", link: "#" },
    { outlet: "Elle Magazine", title: "Rising Stars to Watch", date: "Jul 2024", link: "#" },
];

const PressCard = ({ article, index }: { article: typeof pressArticles[0]; index: number }) => {
    return (
        <motion.a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group block border-t border-border py-8 md:py-12 relative overflow-hidden"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 transition-transform duration-500 group-hover:translate-x-2 px-4">
                <div className="md:w-1/4">
                    <span className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                        {article.outlet}
                    </span>
                    <p className="mt-2 text-sm text-muted-foreground/60">{article.date}</p>
                </div>
                <div className="md:w-1/2">
                    <h3 className="font-display text-2xl md:text-3xl lg:text-4xl group-hover:text-accent transition-colors">
                        {article.title}
                    </h3>
                </div>
                <div className="md:w-1/4 flex justify-end">
                    <span className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground group-hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 duration-300">
                        Read Article <ArrowUpRight className="w-4 h-4" />
                    </span>
                </div>
            </div>

            {/* Hover Background - Subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-0 pointer-events-none" />
        </motion.a>
    );
};

const PressSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section id="press" ref={sectionRef} className="py-24 bg-background">
            <div className="section-padding">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground">
                            Press
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4">
                            Recent <span className="italic font-editorial">Features</span>
                        </h2>
                    </motion.div>
                </div>

                <div className="flex flex-col">
                    {pressArticles.map((article, i) => (
                        <PressCard key={i} article={article} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PressSection;
