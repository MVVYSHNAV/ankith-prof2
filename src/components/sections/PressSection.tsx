import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import filmographyData from "@/data/filmography.json";

/* ─── Video helpers ─── */
const getYoutubeId = (url: string) => {
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return (match && match[2].length === 11) ? match[2] : null;
};

const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/([0-9]+)/);
    return match ? match[1] : null;
};

const getVideoDetails = (url: string) => {
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
type StreamingProvider = "prime" | "sunnxt" | "hotstar";

const providerConfig: Record<StreamingProvider, {
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
                {/* "prime video" text stand-in with arrow */}
                <text x="32" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="#00A8E1" fontFamily="Arial, sans-serif" letterSpacing="1">prime</text>
                <text x="32" y="42" textAnchor="middle" fontSize="8" fontWeight="400" fill="#ffffff" fontFamily="Arial, sans-serif" letterSpacing="2">video</text>
                {/* Smile arrow */}
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
                {/* Sun rays */}
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
                {/* Hotstar star */}
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
const StreamingBadge = ({ provider, url }: { provider: StreamingProvider; url: string }) => {
    const cfg = providerConfig[provider];
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
    provider: StreamingProvider;
    url: string;
    thumbnailUrl?: string;
}) => {
    const cfg = providerConfig[provider];
    if (!cfg) return null;

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
                    <img
                        src={thumbnailUrl}
                        alt={`${title} poster`}
                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
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
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState<{ id: string; url: string; title?: string } | null>(null);

    // @ts-ignore
    const projects = filmographyData.projects;
    // @ts-ignore
    const videos: any[] = filmographyData.videos || [];
    const currentProject = projects[currentIndex];

    const nextProject = () => setCurrentIndex((p) => (p + 1) % projects.length);
    const prevProject = () => setCurrentIndex((p) => (p - 1 + projects.length) % projects.length);

    return (
        <section id="filmography" ref={sectionRef} className="py-24 md:py-32 lg:py-40 section-padding bg-background">
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
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.05em] uppercase mt-4">
                        Featured <span className="font-editorial italic normal-case tracking-wide">Project</span>
                    </h2>
                </motion.div>

                {/* ── Featured project ── */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-20 items-start">

                    {/* Left: Project info */}
                    <motion.div
                        key={currentProject.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:flex-1 space-y-5 md:space-y-7"
                    >
                        <div className="space-y-2">
                            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase leading-none break-words">
                                {currentProject.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-muted-foreground mt-3">
                                <span className="font-body text-xs sm:text-sm tracking-[0.2em] uppercase">{currentProject.role}</span>
                                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                                <span className="font-body text-xs sm:text-sm tracking-[0.2em] uppercase">{currentProject.duration}</span>
                            </div>
                        </div>

                        <div className="space-y-3 max-w-md">
                            <p className="font-editorial text-base sm:text-lg md:text-xl lg:text-2xl italic leading-relaxed text-foreground/80">
                                {currentProject.description}
                            </p>
                            <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                {currentProject.note}
                            </p>
                        </div>

                        {/* Streaming badge below description */}
                        {/* @ts-ignore */}
                        {currentProject.streamingUrl && currentProject.streamingProvider && (
                            <StreamingBadge
                                // @ts-ignore
                                provider={currentProject.streamingProvider as StreamingProvider}
                                // @ts-ignore
                                url={currentProject.streamingUrl}
                            />
                        )}

                        {/* Prev / Next */}
                        <div className="pt-5 flex items-center justify-between border-t border-border">
                            <span className="font-body text-xs tracking-[0.2em] text-muted-foreground">
                                {(currentIndex + 1).toString().padStart(2, "0")} / {projects.length.toString().padStart(2, "0")}
                            </span>
                            <div className="flex gap-6">
                                <button
                                    onClick={prevProject}
                                    className="font-body text-xs tracking-[0.3em] uppercase hover:text-accent transition-colors py-1"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={nextProject}
                                    className="font-body text-xs tracking-[0.3em] uppercase hover:text-accent transition-colors py-1"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: YouTube video OR streaming poster card — always aspect-video (16/9) */}
                    <motion.div
                        key={`media-${currentProject.id}`}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="w-full lg:flex-1 aspect-video relative overflow-hidden rounded-xl border border-border/30 bg-secondary/20"
                    >
                        {/* @ts-ignore */}
                        {currentProject.videoUrl ? (
                            <iframe
                                width="100%"
                                height="100%"
                                // @ts-ignore
                                src={`https://www.youtube.com/embed/${getYoutubeId(currentProject.videoUrl)}`}
                                title={currentProject.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            />
                        ) : /* @ts-ignore */ currentProject.streamingUrl ? (
                            <StreamingCard
                                title={currentProject.title}
                                // @ts-ignore
                                provider={currentProject.streamingProvider as StreamingProvider}
                                // @ts-ignore
                                url={currentProject.streamingUrl}
                                // @ts-ignore
                                thumbnailUrl={currentProject.thumbnailUrl}
                            />
                        ) : null}
                    </motion.div>
                </div>

                {/* ── Video gallery (horizontal scroll) ── */}
                {videos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-20 md:mt-28 lg:mt-32"
                    >
                        <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-light tracking-[0.05em] uppercase mb-8 md:mb-12 text-center">
                            More <span className="font-editorial italic normal-case tracking-wide">Performances</span>
                        </h3>

                        <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
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
                                            <img
                                                src={details.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                                onError={(e) => {
                                                    if (details.type === "youtube") {
                                                        (e.target as HTMLImageElement).style.display = "none";
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-secondary flex items-center justify-center">
                                                <span className="text-muted-foreground text-xs">Video</span>
                                            </div>
                                        );
                                    })()}

                                    {/* Play overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <div className="w-0 h-0 border-t-[5px] sm:border-t-[6px] border-t-transparent border-l-[9px] sm:border-l-[10px] border-l-foreground border-b-[5px] sm:border-b-[6px] border-b-transparent ml-1" />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="font-body text-[10px] sm:text-xs tracking-wide text-white line-clamp-1">
                                            {video.title}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

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
        </section>
    );
};

export default PressSection;
