import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/useSupabase";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
interface PortfolioItem {
    id: string | number;
    src: string;
    alt: string;
    category: string;
    aspect: "square" | "tall" | "wide";
}

const ASPECT_CLASSES: Record<PortfolioItem["aspect"], string> = {
    square: "aspect-square",
    tall: "aspect-[3/4]",
    wide: "aspect-[16/10]",
};

/* ─────────────────────────────────────────────
   Animation variants
   ───────────────────────────────────────────── */
const itemVariants: any = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.055 },
    }),
};

const lightboxVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

const imageVariants: any = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.94, transition: { duration: 0.25, ease: "easeIn" } },
};

/* ─────────────────────────────────────────────
   Sub-component: Gallery Card
   ───────────────────────────────────────────── */
interface GalleryCardProps {
    item: PortfolioItem;
    index: number;
    onOpen: (item: PortfolioItem) => void;
}

const GalleryCard = ({ item, index, onOpen }: GalleryCardProps) => (
    <motion.div
        custom={index % 9}
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="break-inside-avoid mb-4 sm:mb-5 cursor-pointer group relative overflow-hidden rounded-xl sm:rounded-2xl"
        onClick={() => onOpen(item)}
    >
        <div className={`overflow-hidden ${ASPECT_CLASSES[item.aspect] || "aspect-video"}`}>
            <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500 ease-out pointer-events-none" />
    </motion.div>
);

/* ─────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────── */
const PortfolioSection = () => {
    const [lightboxImage, setLightboxImage] = useState<PortfolioItem | null>(null);
    const [visibleCount, setVisibleCount] = useState(3);
    const { data: dbProjects, isLoading } = useProjects();

    const portfolioItems = useMemo(() => {
        if (!dbProjects) return [];

        return dbProjects
            .filter(p => p.category === 'Portfolio')
            .map(p => ({
                id: p.id,
                src: p.image_url || "/placeholder.svg",
                alt: p.title || "Portfolio Capture",
                category: "Modeling",
                aspect: "tall"
            })) as PortfolioItem[];
    }, [dbProjects]);

    const showMore = useCallback(() => {
        const increment = window.matchMedia("(max-width: 640px)").matches ? 3 : 6;
        setVisibleCount((v) => v + increment);
    }, []);

    const showLess = useCallback(() => {
        setVisibleCount(3);
    }, []);

    const openLightbox = useCallback((item: PortfolioItem) => setLightboxImage(item), []);
    const closeLightbox = useCallback(() => setLightboxImage(null), []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [closeLightbox]);

    useEffect(() => {
        document.body.style.overflow = lightboxImage ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [lightboxImage]);

    return (
        <section id="portfolio" className="py-24 md:py-32 section-padding bg-primary">
            <div className="max-w-7xl mx-auto">

                {/* ── Section Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as any }}
                    className="mb-12 md:mb-16"
                >
                    <span className="font-body text-[10px] tracking-[0.45em] uppercase text-primary-foreground/40">
                        Portfolio
                    </span>
                    <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.04em] uppercase text-primary-foreground mt-4 leading-none">
                        Capture
                    </h2>
                </motion.div>

                {/* ── Photography ── */}
                <div>
                    <h3 className="font-body text-[10px] tracking-[0.3em] uppercase text-primary-foreground/50 mb-8 border-l border-primary-foreground/30 pl-4">
                        Photography
                    </h3>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="w-8 h-8 text-accent animate-spin" strokeWidth={1} />
                            <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary-foreground/40">Loading Masterpieces...</span>
                        </div>
                    ) : (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5">
                            {portfolioItems.map((item, index) => (
                                <div key={item.id} className={index >= visibleCount ? "hidden" : "block"}>
                                    <GalleryCard item={item} index={index} onOpen={openLightbox} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-center mt-12 gap-8">
                        {visibleCount < portfolioItems.length && (
                            <button onClick={showMore} className="font-body text-[10px] tracking-[0.4em] uppercase text-primary-foreground/50 hover:text-white border-b border-primary-foreground/20 hover:border-white transition-all pb-1">
                                Load More
                            </button>
                        )}
                        {visibleCount > 3 && (
                            <button onClick={showLess} className="font-body text-[10px] tracking-[0.4em] uppercase text-primary-foreground/50 hover:text-white border-b border-primary-foreground/20 hover:border-white transition-all pb-1">
                                Show Less
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        variants={lightboxVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
                        onClick={closeLightbox}
                    >
                        <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"><X size={24} /></button>
                        <motion.img
                            key={lightboxImage.id}
                            variants={imageVariants}
                            src={lightboxImage.src}
                            alt={lightboxImage.alt}
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default PortfolioSection;
