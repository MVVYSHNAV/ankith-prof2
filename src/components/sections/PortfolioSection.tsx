import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

import { portfolioData } from "@/data/portfolio";

interface PortfolioItem {
    id: number;
    src: string;
    alt: string;
    category: string;
    aspect: string;
}

const { items: portfolioItems, categories } = portfolioData;

const PortfolioSection = () => {
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [lightboxImage, setLightboxImage] = useState<PortfolioItem | null>(null);
    const [visibleCount, setVisibleCount] = useState<number>(6);
    const gridRef = useRef<HTMLDivElement>(null);

    const filteredItems = activeFilter === "all"
        ? portfolioItems
        : portfolioItems.filter((item) => item.category === activeFilter);

    const visibleItems = filteredItems.slice(0, visibleCount);

    // Reset visible count when filter changes
    useEffect(() => {
        setVisibleCount(6);
    }, [activeFilter]);

    // GSAP animation removed to prevent conflict with Framer Motion
    // Framer Motion handles both entrance and layout animations now

    return (
        <section id="portfolio" className="py-32 md:py-40 section-padding bg-secondary/30">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                    <div className="w-full">
                        <span className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground">
                            Portfolio
                        </span>
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mt-4">
                            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.05em] uppercase">
                                Capture
                            </h2>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 pb-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.value}
                                        onClick={() => setActiveFilter(cat.value)}
                                        className={`font-editorial italic text-xl md:text-2xl transition-all duration-300 relative group ${activeFilter === cat.value
                                            ? "text-primary opacity-100"
                                            : "text-muted-foreground opacity-60 hover:opacity-100 hover:text-foreground"
                                            }`}
                                    >
                                        {cat.label}
                                        <span className={`absolute -bottom-1 left-0 w-full h-px bg-primary transition-transform duration-300 origin-left ${activeFilter === cat.value ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                            }`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Masonry Grid */}
                <motion.div
                    ref={gridRef}
                    layout
                    className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
                >
                    <AnimatePresence mode="popLayout">
                        {visibleItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: 0.05 * (index % 6) }}
                                className="portfolio-item break-inside-avoid cursor-pointer group relative overflow-hidden"
                                onClick={() => setLightboxImage(item)}
                            >
                                <div className={`overflow-hidden ${item.aspect === "tall" ? "aspect-[3/4]" :
                                    item.aspect === "wide" ? "aspect-[16/10]" :
                                        "aspect-square"
                                    }`}>
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 image-editorial"
                                        loading="lazy"
                                    />
                                </div>
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-all duration-500 flex items-end p-6">
                                    <div className="translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary-foreground/70">
                                            {item.category}
                                        </span>
                                        <p className="font-editorial text-xl text-primary-foreground mt-1">
                                            {item.alt}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Show More Button */}
                {filteredItems.length > visibleCount && (
                    <div className="flex justify-center mt-16">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground border-b border-border hover:border-foreground pb-2 transition-all duration-300"
                        >
                            Show More
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-sm flex items-center justify-center p-6 md:p-12"
                        onClick={() => setLightboxImage(null)}
                    >
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            src={lightboxImage.src}
                            alt={lightboxImage.alt}
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={() => setLightboxImage(null)}
                            className="absolute top-6 right-6 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                            aria-label="Close lightbox"
                        >
                            <X size={28} strokeWidth={1} />
                        </button>
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary-foreground/50">
                                {lightboxImage.category}
                            </span>
                            <p className="font-editorial text-xl text-primary-foreground/80 mt-1">
                                {lightboxImage.alt}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default PortfolioSection;
