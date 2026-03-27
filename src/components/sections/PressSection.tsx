import { useRef, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useProjects } from "@/hooks/useSupabase";
import OptimizedImage from "@/components/ui/OptimizedImage";

/* ─── Video helpers ─── */
const getYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return (match && match[2].length === 11) ? match[2] : null;
};

const getVimeoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/vimeo\.com\/([0-9]+)/);
    return match ? match[1] : null;
};

const getVideoDetails = (url: string) => {
    if (!url) return null;
    const youtubeId = getYoutubeId(url);
    const vimeoId = getVimeoId(url);
    if (youtubeId) return {
        type: "youtube",
        id: youtubeId,
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
    };
    if (vimeoId) return {
        type: "vimeo",
        id: vimeoId,
        thumbnail: `https://vumbnail.com/${vimeoId}.jpg`,
        embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
    };
    return null;
};

/* ─── Streaming provider config ─── */
type StreamingProvider = "prime" | "sunnxt" | "hotstar" | string;

const providerConfig: Record<string, {
    label: string;
    accentColor: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    logo: React.ReactNode;
}> = {
    prime: {
        label: "Prime Video",
        accentColor: "#00A8E1",
        badgeBg: "rgba(0,168,225,0.15)",
        badgeText: "#00A8E1",
        badgeBorder: "rgba(0,168,225,0.4)",
        logo: (
            /* Amazon Prime Video word-mark icon — blue arrow smile */
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect width="64" height="64" rx="12" fill="#1A1A2E" />
                <text x="32" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="#00A8E1" fontFamily="Arial, sans-serif" letterSpacing="1">prime</text>
                <text x="32" y="42" textAnchor="middle" fontSize="8" fontWeight="400" fill="#ffffff" fontFamily="Arial, sans-serif" letterSpacing="2">video</text>
                <path d="M18 50 Q32 58 46 50" stroke="#FF9900" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M43 48 L46 50 L43 52" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    sunnxt: {
        label: "SUN NXT",
        accentColor: "#FF6B00",
        badgeBg: "rgba(255,107,0,0.15)",
        badgeText: "#FF9B4E",
        badgeBorder: "rgba(255,107,0,0.4)",
        logo: (
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect width="64" height="64" rx="12" fill="#FF6B00" />
                <circle cx="32" cy="27" r="9" fill="#FFD700" />
                <g stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="32" y1="10" x2="32" y2="14" />
                    <line x1="32" y1="40" x2="32" y2="44" />
                    <line x1="15" y1="27" x2="19" y2="27" />
                    <line x1="45" y1="27" x2="49" y2="27" />
                    <line x1="20.1" y1="15.1" x2="23" y2="18" />
                    <line x1="41" y1="36" x2="43.9" y2="38.9" />
                    <line x1="43.9" y1="15.1" x2="41" y2="18" />
                    <line x1="23" y1="36" x2="20.1" y2="38.9" />
                </g>
                <text x="32" y="56" textAnchor="middle" fontSize="9" fontWeight="800" fill="white" fontFamily="Arial, sans-serif" letterSpacing="1.5">NXT</text>
            </svg>
        ),
    },
    hotstar: {
        label: "JioHotstar",
        accentColor: "#4F7CF8",
        badgeBg: "rgba(79,124,248,0.15)",
        badgeText: "#4F7CF8",
        badgeBorder: "rgba(79,124,248,0.4)",
        logo: (
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <linearGradient id="hs2" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#1B45A6" />
                        <stop offset="100%" stopColor="#6B8EFF" />
                    </linearGradient>
                </defs>
                <rect width="64" height="64" rx="12" fill="url(#hs2)" />
                <polygon
                    points="32,8 36.9,22.8 52,22.8 39.6,31.7 44.5,46.5 32,37.6 19.5,46.5 24.4,31.7 12,22.8 27.1,22.8"
                    fill="#FFD700"
                />
                <text x="32" y="60" textAnchor="middle" fontSize="7" fontWeight="700" fill="rgba(255,255,255,0.7)" fontFamily="Arial, sans-serif" letterSpacing="0.5">JioHotstar</text>
            </svg>
        ),
    },
};


/* ─── Inline badge (below description) ─── */
const StreamingBadge = ({ provider, url }: { provider: string; url: string }) => {
    const cfg = providerConfig[provider.toLowerCase()];
    if (!cfg) return null;
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: cfg.badgeBg, color: cfg.badgeText, borderColor: cfg.badgeBorder }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-body tracking-wide transition-all duration-200 hover:opacity-80 cursor-pointer select-none"
            onClick={(e) => e.stopPropagation()}
        >
            <span className="w-3.5 h-3.5 shrink-0" style={{ color: cfg.badgeText }}>
                <svg viewBox="0 0 24 24" className="w-full h-full fill-current"><path d="M8 5v14l11-7z" /></svg>
            </span>
            <span>Watch on {cfg.label}</span>
            <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
        </a>
    );
};

/* ─── Streaming preview card with poster thumbnail ─── */
const StreamingCard = ({
    title,
    provider,
    url,
    thumbnailUrl,
}: {
    title: string;
    provider: string;
    url: string;
    thumbnailUrl?: string;
}) => {
    const cfg = providerConfig[provider.toLowerCase()] || providerConfig['prime'];

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex overflow-hidden group cursor-pointer"
        >
            {/* ── Left: Portrait poster strip (40% of width) ── */}
            <div className="relative w-[42%] shrink-0 overflow-hidden">
                {thumbnailUrl ? (
                    <OptimizedImage
                        src={thumbnailUrl}
                        alt={`${title} poster`}
                        className="object-top transition-transform duration-500 group-hover:scale-105"
                        containerClassName="absolute inset-0"
                    />
                ) : (
                    <div className="absolute inset-0 bg-secondary/60" />
                )}
                {/* Fade to the right */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/80" />
            </div>

            {/* ── Right: Dark info panel (60% of width) ── */}
            <div className="flex-1 relative bg-black/90 flex flex-col justify-between p-4 sm:p-5 md:p-6 overflow-hidden">
                {/* Subtle tinted bg using accentColor */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{ background: `radial-gradient(ellipse at top left, ${cfg.accentColor}, transparent 70%)` }}
                />

                {/* Provider pill — top */}
                <div className="relative z-10 flex items-center gap-2">
                    <span className="w-6 h-6 sm:w-7 sm:h-7 shrink-0">{cfg.logo}</span>
                    <span
                        className="text-[10px] sm:text-xs font-body tracking-[0.2em] uppercase"
                        style={{ color: cfg.badgeText }}
                    >
                        {cfg.label}
                    </span>
                </div>

                {/* Movie info — bottom */}
                <div className="relative z-10 space-y-2 sm:space-y-3">
                    <div>
                        <p className="font-body text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/50 mb-1">
                            Now Streaming
                        </p>
                        <p className="font-display text-sm sm:text-base md:text-lg lg:text-xl uppercase text-white leading-tight line-clamp-2">
                            {title}
                        </p>
                    </div>

                    {/* Watch Now button */}
                    <div
                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-body tracking-wide transition-all duration-200 group-hover:scale-105"
                        style={{
                            background: cfg.badgeBg,
                            color: cfg.badgeText,
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: cfg.badgeBorder,
                        }}
                    >
                        <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch Now
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-2 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                    </div>
                </div>
            </div>
        </a>
    );
};

/* ─── Main section ─── */
const PressSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const interviewsScrollContainerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const { data: dbProjects } = useProjects();

    const [selectedVideo, setSelectedVideo] = useState<{ id: string; url: string; title?: string } | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { showreelProject, filmProjects, videos, interviews } = useMemo(() => {
        const showreel = (dbProjects || []).find(p => p.category === 'Showreel') || {
            title: "Actor AnkithMadhav's Feature Films Showreel.",
            description: "This showreel gives a glimpse into the versatile actor AnkithMadhav's commendable works in multi language Feature Films.",
            note: "A compilation of performances across various genres and languages.",
            video_url: "https://youtu.be/8y_6zaauhf0?si=xsWCR8Gle5VKv4jH"
        };

        const films = (dbProjects || [])
            .filter(p => p.category === 'Filmography')
            .map(p => ({
                id: p.id,
                title: p.title,
                role: p.role || "Actor",
                duration: p.duration || "",
                description: p.description || "",
                note: p.note || "",
                thumbnailUrl: p.image_url,
                streamingUrl: p.streaming_url,
                streamingProvider: p.streaming_provider
            }));

        const ads = (dbProjects || [])
            .filter(p => p.category === 'Ad')
            .map(p => ({
                id: p.id,
                title: p.title,
                url: p.video_url || ""
            }));

        const interviewsList = (dbProjects || [])
            .filter(p => p.category === 'Interview')
            .map(p => ({
                id: p.id,
                title: p.title,
                url: p.video_url || ""
            }));

        return { showreelProject: showreel, filmProjects: films, videos: ads, interviews: interviewsList };
    }, [dbProjects]);

    const nextProject = () => setCurrentIndex((p) => (p + 1) % (filmProjects.length || 1));
    const prevProject = () => setCurrentIndex((p) => (p - 1 + (filmProjects.length || 1)) % (filmProjects.length || 1));

    return (
        <>
            <section id="filmography" ref={sectionRef} className="py-24 md:py-32 lg:py-40 section-padding bg-background text-foreground transition-colors duration-500">
                <div className="max-w-7xl mx-auto">

                    {/* ── Header ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="mb-12 md:mb-16 lg:mb-24"
                    >
                        <span className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground">
                            Filmography
                        </span>
                    </motion.div>

                    {/* ── Featured Showreel ── */}
                    <div className="mb-12 md:mb-16">
                        <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-light uppercase tracking-[0.04em] text-foreground leading-none mb-8 sm:mb-12 md:mb-16">
                            Showreel
                        </h3>
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
                            {/* Left: Info */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="w-full lg:w-1/3 space-y-5"
                            >
                                <h4 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase leading-tight">
                                    {showreelProject.title}
                                </h4>
                                <div className="space-y-3">
                                    <p className="font-editorial text-lg italic text-foreground/90 leading-relaxed">
                                        {showreelProject.description}
                                    </p>
                                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                        {showreelProject.note}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Right: Video Player */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="w-full lg:w-2/3 aspect-video relative overflow-hidden rounded-xl border border-foreground/10 bg-muted/30"
                            >
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${getYoutubeId((showreelProject as any).video_url || (showreelProject as any).videoUrl)}`}
                                    title={showreelProject.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* ── Film Credits (Modern Card Swap) ── */}
                    <div className="mb-12 md:mb-16">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
                            <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-light uppercase tracking-[0.04em] text-foreground leading-none">
                                Film Credits
                            </h3>
                            <div className="flex gap-8 items-center">
                                <span className="font-body text-[10px] tracking-widest text-muted-foreground hidden sm:block">
                                    SWIPE OR USE NAV
                                </span>
                                <div className="flex gap-6">
                                    <button onClick={prevProject} className="font-body text-[10px] tracking-[0.3em] uppercase hover:text-accent transition-colors text-muted-foreground">Prev</button>
                                    <button onClick={nextProject} className="font-body text-[10px] tracking-[0.3em] uppercase hover:text-accent transition-colors text-muted-foreground">Next</button>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-[500px] md:h-[600px] lg:h-[650px] w-full flex items-center justify-center perspective-[1200px]">
                            <AnimatePresence initial={false}>
                                {filmProjects.map((project: any, index: number) => {
                                    const isCurrent = index === currentIndex;
                                    const isNext = index === (currentIndex + 1) % filmProjects.length;

                                    if (!isCurrent && !isNext) return null;

                                    return (
                                        <motion.div
                                            key={project.id}
                                            style={{ zIndex: isCurrent ? 20 : 10 }}
                                            initial={{ opacity: 0, scale: 0.8, x: 100, rotateY: 20 }}
                                            animate={{
                                                opacity: isCurrent ? 1 : 0.4,
                                                scale: isCurrent ? 1 : 0.92,
                                                x: isCurrent ? 0 : 50,
                                                rotateY: isCurrent ? 0 : -12,
                                                z: isCurrent ? 0 : -150
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.7,
                                                x: -300,
                                                rotateY: -45,
                                                transition: { duration: 0.5, ease: "easeIn" }
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 25
                                            }}
                                            drag="x"
                                            dragConstraints={{ left: 0, right: 0 }}
                                            onDragEnd={(_, info) => {
                                                if (info.offset.x < -100) nextProject();
                                                if (info.offset.x > 100) prevProject();
                                            }}
                                            className="absolute w-full max-w-5xl h-full cursor-grab active:cursor-grabbing"
                                        >
                                            <div className="w-full h-full relative group overflow-hidden rounded-2xl md:rounded-3xl border border-foreground/10 bg-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                                                <OptimizedImage
                                                    src={project.thumbnailUrl}
                                                    alt={project.title}
                                                    className="opacity-50 group-hover:opacity-80 transition-opacity duration-1000"
                                                    containerClassName="absolute inset-0"
                                                />

                                                {/* Vignette Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent hidden md:block" />

                                                {/* Content - Responsive Padding */}
                                                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14 lg:p-16">
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -30 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.3 }}
                                                        className="max-w-3xl"
                                                    >
                                                        <div className="flex items-center gap-4 mb-3 md:mb-5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                                                                <span className="text-[10px] tracking-[0.3em] font-body uppercase text-white/50">
                                                                    {project.role}
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] tracking-[0.3em] font-body uppercase text-white/20">•</span>
                                                            <span className="text-[10px] tracking-[0.3em] font-body uppercase text-white/50">
                                                                {project.duration}
                                                            </span>
                                                        </div>

                                                        <h4 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase text-white mb-2 sm:mb-4 leading-[0.85] tracking-tight">
                                                            {project.title}
                                                        </h4>

                                                        <p className="font-editorial text-lg sm:text-xl md:text-2xl italic text-white/70 leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
                                                            {project.description}
                                                        </p>

                                                        {project.note && (
                                                            <p className="font-body text-[10px] sm:text-xs tracking-[0.25em] uppercase text-white/30 mb-8 sm:mb-12">
                                                                {project.note}
                                                            </p>
                                                        )}

                                                        <div className="flex flex-wrap items-center gap-8 sm:gap-12">
                                                            {project.streamingUrl && (
                                                                <a
                                                                    href={project.streamingUrl}
                                                                    target="_blank"
                                                                    className="flex items-center gap-5 group/btn"
                                                                >
                                                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover/btn:bg-white group-hover/btn:text-black transition-all duration-500 group-hover/btn:scale-110">
                                                                        <Play size={18} fill="currentColor" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[8px] tracking-[0.4em] uppercase text-white/30 mb-1.5">Watch Official</span>
                                                                        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white group-hover/btn:translate-x-1 transition-transform">Stream Now</span>
                                                                    </div>
                                                                </a>
                                                            )}

                                                            {project.streamingProvider && (
                                                                <div className="hidden sm:flex flex-col border-l border-white/10 pl-8">
                                                                    <span className="text-[8px] tracking-[0.4em] uppercase text-white/30 mb-2">Available On</span>
                                                                    <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/60">{project.streamingProvider}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                </div>

                                                {/* Visual Counter */}
                                                <div className="absolute top-10 right-10 hidden md:flex items-center gap-4">
                                                    <span className="font-body text-[10px] tracking-[0.4em] text-white/30">
                                                        {(index + 1).toString().padStart(2, '0')}
                                                    </span>
                                                    <div className="h-px w-12 bg-white/10" />
                                                    <span className="font-body text-[10px] tracking-[0.4em] text-white/60">
                                                        {filmProjects.length.toString().padStart(2, '0')}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Media gallery (Interviews) ── */}
            {interviews.length > 0 && (
                <section className="py-8 md:py-12 section-padding bg-background text-foreground">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-light uppercase tracking-[0.04em] text-foreground mb-8 sm:mb-12 md:mb-16">
                                Media{/* Media <span className="font-editorial italic normal-case tracking-wide text-foreground">Interviews</span> */}
                            </h3>

                            <div className="group/scroll relative">
                                <div
                                    ref={interviewsScrollContainerRef}
                                    className={`flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 scroll-smooth ${interviews.length === 1 ? "md:justify-center" : interviews.length === 2 ? "lg:justify-center" : ""
                                        }`}
                                >
                                    {interviews.map((video: any, index: number) => (
                                        <motion.div
                                            key={video.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.08 }}
                                            className="min-w-[78vw] sm:min-w-[340px] md:min-w-[380px] snap-center shrink-0 aspect-video bg-secondary/30 relative group cursor-pointer overflow-hidden border border-border/50 hover:border-foreground/20 rounded-lg transition-all duration-300"
                                            onClick={() => setSelectedVideo(video)}
                                        >
                                            {(() => {
                                                const details = getVideoDetails(video.url);
                                                return details ? (
                                                    <OptimizedImage
                                                        src={details.thumbnail}
                                                        alt={video.title}
                                                        className="opacity-80 group-hover:opacity-100 transition-all duration-500"
                                                        containerClassName="absolute inset-0"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                                                        <span className="text-muted-foreground text-xs">Video</span>
                                                    </div>
                                                );
                                            })()}

                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <div className="w-0 h-0 border-t-[5px] sm:border-t-[6px] border-t-transparent border-l-[9px] sm:border-l-[10px] border-l-foreground border-b-[5px] sm:border-b-[6px] border-b-transparent ml-1" />
                                                </div>
                                            </div>

                                            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
                                                <p className="font-body text-[10px] sm:text-xs tracking-wide text-white line-clamp-1">
                                                    {video.title}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Floating Right Navigation Only */}
                                <button
                                    onClick={() => {
                                        if (interviewsScrollContainerRef.current) {
                                            interviewsScrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                                        }
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-foreground opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300 hidden md:flex hover:bg-background/60"
                                    aria-label="Scroll Right"
                                >
                                    <ChevronRight size={24} strokeWidth={1.5} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ── Video gallery (More Performances) ── */}
            {videos.length > 0 && (
                <section className="py-8 md:py-12 section-padding bg-background text-foreground">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-light uppercase tracking-[0.04em] text-foreground mb-8 sm:mb-12 md:mb-16">
                                Random <span className="font-editorial italic normal-case tracking-wide text-foreground">Adds</span>
                            </h3>

                            <div className="group/scroll relative">
                                <div
                                    ref={scrollContainerRef}
                                    className={`flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 scroll-smooth ${videos.length === 1 ? "md:justify-center" : videos.length === 2 ? "lg:justify-center" : ""
                                        }`}
                                >
                                    {videos.map((video: any, index: number) => (
                                        <motion.div
                                            key={video.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.08 }}
                                            className="min-w-[78vw] sm:min-w-[340px] md:min-w-[380px] snap-center shrink-0 aspect-video bg-secondary/30 relative group cursor-pointer overflow-hidden border border-border/50 hover:border-foreground/20 rounded-lg transition-all duration-300"
                                            onClick={() => setSelectedVideo(video)}
                                        >
                                            {(() => {
                                                const details = getVideoDetails(video.url);
                                                return details ? (
                                                    <OptimizedImage
                                                        src={details.thumbnail}
                                                        alt={video.title}
                                                        className="opacity-80 group-hover:opacity-100 transition-all duration-500"
                                                        containerClassName="absolute inset-0"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                                                        <span className="text-muted-foreground text-xs">Video</span>
                                                    </div>
                                                );
                                            })()}

                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <div className="w-0 h-0 border-t-[5px] sm:border-t-[6px] border-t-transparent border-l-[9px] sm:border-l-[10px] border-l-foreground border-b-[5px] sm:border-b-[6px] border-b-transparent ml-1" />
                                                </div>
                                            </div>

                                            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
                                                <p className="font-body text-[10px] sm:text-xs tracking-wide text-white line-clamp-1">
                                                    {video.title}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Floating Right Navigation Only */}
                                <button
                                    onClick={() => {
                                        if (scrollContainerRef.current) {
                                            scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                                        }
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-foreground opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300 hidden md:flex hover:bg-background/60"
                                    aria-label="Scroll Right"
                                >
                                    <ChevronRight size={24} strokeWidth={1.5} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ── Video lightbox ── */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="relative w-full max-w-5xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute -top-9 right-0 text-foreground hover:text-accent transition-colors font-body text-xs tracking-widest uppercase"
                        >
                            Close
                        </button>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                            {(() => {
                                const details = getVideoDetails(selectedVideo.url);
                                return details ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`${details.embedUrl}?autoplay=1`}
                                        title={selectedVideo.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                ) : null;
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PressSection;
