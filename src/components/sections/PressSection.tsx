import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { useState } from "react";
import filmographyData from "@/data/filmography.json";

const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const getVimeoId = (url: string) => {
    const regExp = /vimeo\.com\/([0-9]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
};

const getVideoDetails = (url: string) => {
    const youtubeId = getYoutubeId(url);
    const vimeoId = getVimeoId(url);

    if (youtubeId) {
        return {
            type: 'youtube',
            id: youtubeId,
            thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
            embedUrl: `https://www.youtube.com/embed/${youtubeId}`
        };
    }

    if (vimeoId) {
        return {
            type: 'vimeo',
            id: vimeoId,
            // Vimeo thumbnails require API, using a placeholder/fallback or just the video ID for now?
            // Actually, for a list, we might want to just show a generic "Play on Vimeo" or similar if we can't get the thumb easily.
            // But let's try to use a service or just a standard placeholder for now.
            // There isn't a simple "img.vimeo.com/id" endpoint without an API call.
            // We'll use a placeholder colored box or similar if we strictly can't get it, 
            // OR we can try to use a 3rd party service like `vumbnail.com` which is often used for this.
            thumbnail: `https://vumbnail.com/${vimeoId}.jpg`,
            embedUrl: `https://player.vimeo.com/video/${vimeoId}`
        };
    }

    return null;
};

const PressSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState<{ id: string, url: string, title?: string } | null>(null);

    const projects = filmographyData.projects;
    // @ts-ignore
    const videos = filmographyData.videos || [];
    const currentProject = projects[currentIndex];


    const nextProject = () => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
    };

    const prevProject = () => {
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

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
                        key={currentProject.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 space-y-8"
                    >
                        <div className="space-y-2">
                            <h3 className="font-display text-5xl md:text-7xl uppercase leading-none">
                                {currentProject.title}
                            </h3>
                            <div className="flex items-center gap-6 text-muted-foreground">
                                <span className="font-body text-sm tracking-[0.2em] uppercase">{currentProject.role}</span>
                                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                                <span className="font-body text-sm tracking-[0.2em] uppercase">{currentProject.duration}</span>
                            </div>
                        </div>

                        <div className="space-y-6 max-w-md">
                            <p className="font-editorial text-xl md:text-2xl italic leading-relaxed text-foreground/80">
                                {currentProject.description}
                            </p>
                            <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                {currentProject.note}
                            </p>
                        </div>

                        <div className="pt-8 flex items-center justify-between border-t border-border mt-auto">
                            <span className="font-body text-xs tracking-[0.2em] text-muted-foreground">
                                {(currentIndex + 1).toString().padStart(2, '0')} / {projects.length.toString().padStart(2, '0')}
                            </span>
                            <div className="flex gap-8">
                                <button onClick={prevProject} className="font-body text-xs tracking-[0.3em] uppercase hover:text-accent transition-colors">Prev</button>
                                <button onClick={nextProject} className="font-body text-xs tracking-[0.3em] uppercase hover:text-accent transition-colors">Next</button>
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
                        {/* Video or Image */}
                        {/* @ts-ignore - videoUrl may not exist on all items yet */}
                        {currentProject.videoUrl ? (
                            <iframe
                                width="100%"
                                height="100%"
                                // @ts-ignore
                                src={`https://www.youtube.com/embed/${getYoutubeId(currentProject.videoUrl)}`}
                                title={currentProject.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full object-cover"
                            ></iframe>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground">Project Preview</span>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Video Gallery Grid */}
                {videos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-24 md:mt-32"
                    >
                        <h3 className="font-display text-2xl md:text-3xl font-light tracking-[0.05em] uppercase mb-12 text-center">
                            More <span className="font-editorial italic normal-case tracking-wide">Performances</span>
                        </h3>

                        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:-mx-0 md:px-0">
                            {videos.map((video: any, index: number) => (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="min-w-[85vw] md:min-w-[400px] snap-center shrink-0 aspect-video bg-secondary/30 relative group cursor-pointer overflow-hidden border border-border/50 hover:border-foreground/20 transition-all duration-300"
                                    onClick={() => setSelectedVideo(video)}
                                >
                                    {/* Thumbnail Placeholder */}
                                    {(() => {
                                        const details = getVideoDetails(video.url);
                                        return details ? (
                                            <img
                                                src={details.thumbnail}
                                                onError={(e) => {
                                                    // Fallback for YouTube maxres
                                                    if (details.type === 'youtube') {
                                                        (e.target as HTMLImageElement).style.display = 'none'; // simple hide for now or swap src
                                                    }
                                                }}
                                                alt={video.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-secondary flex items-center justify-center">
                                                <span className="text-muted-foreground text-xs">Video</span>
                                            </div>
                                        );
                                    })()}

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
                                        <div className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center pl-1 group-hover:scale-110 transition-transform duration-300">
                                            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-foreground border-b-[6px] border-b-transparent ml-1" />
                                        </div>
                                    </div>

                                    {/* Title Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="font-body text-xs tracking-wide text-white line-clamp-1">
                                            {video.title}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Video Lightbox */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute -top-12 right-0 text-foreground hover:text-accent transition-colors flex items-center gap-2 font-body text-xs tracking-widest uppercase"
                        >
                            Close
                        </button>
                        {selectedVideo && (() => {
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
                                ></iframe>
                            ) : null;
                        })()}
                    </div>
                </div>
            )}
        </section>
    );
};

export default PressSection;
