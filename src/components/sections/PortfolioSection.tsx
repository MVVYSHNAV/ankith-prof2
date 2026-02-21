import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface PortfolioItem {
    id: number;
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
const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.055 },
    }),
};

const lightboxVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

const imageVariants = {
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
        viewport={{ once: true, margin: "-60px" }}
        className="break-inside-avoid mb-4 sm:mb-5 cursor-pointer group relative overflow-hidden rounded-xl sm:rounded-2xl"
        onClick={() => onOpen(item)}
    >
        {/* Image wrapper */}
        <div className={`overflow-hidden ${ASPECT_CLASSES[item.aspect]}`}>
            <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500 ease-out pointer-events-none" />

        {/* Caption reveal */}
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <p className="font-editorial text-base text-white leading-snug line-clamp-2 drop-shadow-sm">
                {item.alt}
            </p>
        </div>
    </motion.div>
);

/* ─────────────────────────────────────────────
   Sub-component: Lightbox
───────────────────────────────────────────── */
interface LightboxProps {
    item: PortfolioItem;
    onClose: () => void;
}

const Lightbox = ({ item, onClose }: LightboxProps) => (
    <motion.div
        key="lightbox-backdrop"
        variants={lightboxVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-5 md:p-14"
        onClick={onClose}
    >
        {/* Close button */}
        <button
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute top-5 right-5 md:top-7 md:right-7 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200 z-10"
        >
            <X size={20} strokeWidth={1.5} />
        </button>

        {/* Image */}
        <motion.img
            key={item.id}
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            src={item.src}
            alt={item.alt}
            className="max-w-full max-h-full object-contain rounded-xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
        />

        {/* Caption */}
        <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center px-6 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
        >
            <p className="font-editorial text-sm md:text-base text-white/60 tracking-wide line-clamp-1">
                {item.alt}
            </p>
        </div>
    </motion.div>
);

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
const portfolioItems = portfolioData.items as PortfolioItem[];

const MOBILE_PAGE = 3;

const PortfolioSection = () => {
    const [lightboxImage, setLightboxImage] = useState<PortfolioItem | null>(null);
    const [mobileVisible, setMobileVisible] = useState(MOBILE_PAGE);

    const showMore = useCallback(() => setMobileVisible((v) => v + MOBILE_PAGE), []);

    const openLightbox = useCallback((item: PortfolioItem) => setLightboxImage(item), []);
    const closeLightbox = useCallback(() => setLightboxImage(null), []);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [closeLightbox]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        document.body.style.overflow = lightboxImage ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [lightboxImage]);

    return (
        <section id="portfolio" className="py-28 md:py-40 section-padding bg-primary">
            <div className="max-w-7xl mx-auto">

                {/* ── Section header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-16 md:mb-20"
                >
                    <span className="font-body text-[10px] tracking-[0.45em] uppercase text-primary-foreground/40">
                        Portfolio
                    </span>
                    <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.04em] uppercase text-primary-foreground mt-4 leading-none">
                        Capture
                    </h2>
                </motion.div>

                {/* ── Masonry grid ── */}
                {/* CSS columns — true masonry, no JS layout libraries */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5">
                    {portfolioItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={index >= mobileVisible ? "hidden sm:block" : "block"}
                        >
                            <GalleryCard
                                item={item}
                                index={index}
                                onOpen={openLightbox}
                            />
                        </div>
                    ))}
                </div>

                {/* ── Show More (mobile only) ── */}
                {mobileVisible < portfolioItems.length && (
                    <div className="flex justify-center mt-10 sm:hidden">
                        <button
                            onClick={showMore}
                            className="font-body text-xs tracking-[0.35em] uppercase text-primary-foreground/60 hover:text-primary-foreground border-b border-primary-foreground/20 hover:border-primary-foreground/60 pb-1.5 transition-all duration-300"
                        >
                            Show More
                        </button>
                    </div>
                )}
            </div>

            {/* ── Lightbox ── */}
            <AnimatePresence>
                {lightboxImage && (
                    <Lightbox item={lightboxImage} onClose={closeLightbox} />
                )}
            </AnimatePresence>
        </section>
    );
};

export default PortfolioSection;
