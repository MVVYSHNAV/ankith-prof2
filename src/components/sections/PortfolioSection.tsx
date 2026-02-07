import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type Category = "all" | "editorial" | "runway" | "commercial" | "campaign";

interface PortfolioItem {
    id: number;
    src: string;
    alt: string;
    category: Exclude<Category, "all">;
    aspect: "tall" | "square" | "wide";
}

const portfolioItems: PortfolioItem[] = [
    { id: 1, src: "https://images.unsplash.com/photo-1534030347209-7147fd69a3f2?q=80&w=2400", alt: "Ankith Madhav - Vogue Beauty Editorial", category: "editorial", aspect: "square" },
    { id: 2, src: "https://images.unsplash.com/photo-1529139574466-a302d20525a4?q=80&w=2400", alt: "Ankith Madhav - Milan Fashion Week FW24", category: "runway", aspect: "tall" },
    { id: 3, src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2400", alt: "Ankith Madhav - Luxury Silk Campaign", category: "commercial", aspect: "square" },
    { id: 4, src: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=2400", alt: "Ankith Madhav - Dior Haute Couture", category: "campaign", aspect: "tall" },
    { id: 5, src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2400", alt: "Ankith Madhav - Street Style Editorial", category: "editorial", aspect: "tall" },
    { id: 6, src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2400", alt: "Ankith Madhav - Runway Finale Look", category: "runway", aspect: "wide" },
    { id: 7, src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2400", alt: "Ankith Madhav - Fine Art Portrait Series", category: "editorial", aspect: "tall" },
    { id: 8, src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2400", alt: "Ankith Madhav - Urban Campaign", category: "campaign", aspect: "wide" },
    // Add more placeholders if needed to reach 29? No, just keep what we have.
];

const categories: { label: string; value: Category }[] = [
    { label: "All", value: "all" },
    { label: "Editorial", value: "editorial" },
    { label: "Runway", value: "runway" },
    { label: "Commercial", value: "commercial" },
    { label: "Campaign", value: "campaign" },
];

const PortfolioSection = () => {
    const [activeFilter, setActiveFilter] = useState<Category>("all");
    const [lightboxImage, setLightboxImage] = useState<PortfolioItem | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const filteredItems = activeFilter === "all"
        ? portfolioItems
        : portfolioItems.filter((item) => item.category === activeFilter);

    useEffect(() => {
        if (!gridRef.current) return;

        gsap.from(".portfolio-item", {
            scrollTrigger: {
                trigger: gridRef.current,
                start: "top 80%",
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
        });
    }, []);

    return (
        <section id="portfolio" className="py-32 md:py-40 section-padding bg-secondary/30">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                    <div>
                        <span className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground">
                            Portfolio
                        </span>
                        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.05em] uppercase mt-4">
                            Selected
                            <br />
                            <span className="font-editorial italic font-light normal-case tracking-wide">
                                Works
                            </span>
                        </h2>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setActiveFilter(cat.value)}
                                className={`font-body text-xs tracking-[0.25em] uppercase px-5 py-2.5 border transition-all duration-300 ${activeFilter === cat.value
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Masonry Grid */}
                <motion.div
                    ref={gridRef}
                    layout
                    className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
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
                <div className="flex justify-center mt-16">
                    <button className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground border-b border-border hover:border-foreground pb-2 transition-all duration-300">
                        Show More
                    </button>
                </div>
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
