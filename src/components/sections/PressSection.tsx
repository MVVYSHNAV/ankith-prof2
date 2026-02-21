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

/* ─── Component ─── */
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
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 xl:gap-24 items-start">

                    {/* Project Info */}
                    <motion.div
                        key={currentProject.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:flex-1 space-y-6 md:space-y-8"
                    >
                        <div className="space-y-2">
                            <h3 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-none break-words">
                                {currentProject.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-muted-foreground mt-3">
                                <span className="font-body text-xs sm:text-sm tracking-[0.2em] uppercase">{currentProject.role}</span>
                                <span className="w-1 h-1 bg-muted-foreground rounded-full hidden sm:block" />
                                <span className="font-body text-xs sm:text-sm tracking-[0.2em] uppercase">{currentProject.duration}</span>
                            </div>
                        </div>

                        <div className="space-y-4 max-w-md">
                            <p className="font-editorial text-lg sm:text-xl md:text-2xl italic leading-relaxed text-foreground/80">
                                {currentProject.description}
                            </p>
                            <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                {currentProject.note}
                            </p>
                        </div>

                        {/* Prev / Next */}
                        <div className="pt-6 flex items-center justify-between border-t border-border">
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

                    {/* Video embed */}
                    {/* @ts-ignore */}
                    {currentProject.videoUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="w-full lg:flex-1 aspect-video bg-secondary/50 relative overflow-hidden rounded-lg"
                        >
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
                        </motion.div>
                    )}
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

                        {/* Scroll container — bleeds to edges on mobile */}
                        <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
                            {videos.map((video: any, index: number) => (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    className="min-w-[78vw] sm:min-w-[360px] md:min-w-[400px] snap-center shrink-0 aspect-video bg-secondary/30 relative group cursor-pointer overflow-hidden border border-border/50 hover:border-foreground/20 rounded-lg transition-all duration-300"
                                    onClick={() => setSelectedVideo(video)}
                                >
                                    {/* Thumbnail */}
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

                                    {/* Play button */}
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
                        {/* Close — above the video on all screen sizes */}
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
