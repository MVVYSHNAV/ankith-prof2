import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import {
    useResumeFilms, useResumeTv, useResumeTheater,
    useResumeEducation, useResumeTraining, useResumeCommercials
} from "@/hooks/useSupabase";

interface ResumeSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

const ResumeSheet = ({ isOpen, onClose }: ResumeSheetProps) => {
    const { data: films, isLoading: filmsLoading } = useResumeFilms();
    const { data: tvShows, isLoading: tvLoading } = useResumeTv();
    const { data: theater, isLoading: theaterLoading } = useResumeTheater();
    const { data: education, isLoading: eduLoading } = useResumeEducation();
    const { data: training, isLoading: trainingLoading } = useResumeTraining();
    const { data: commercials, isLoading: commercialsLoading } = useResumeCommercials();

    const isLoading = filmsLoading || tvLoading || theaterLoading || eduLoading || trainingLoading || commercialsLoading;

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[85vw] lg:w-[60vw] xl:w-[50vw] bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="p-8 md:p-12 min-h-full relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="space-y-12">
                                {/* Header */}
                                <div className="flex flex-col gap-6 border-b border-border/50 pb-8 mt-8">
                                    <div>
                                        <span className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground">
                                            Professional Experience
                                        </span>
                                        <h2 className="font-display text-4xl md:text-5xl font-light tracking-[0.05em] uppercase mt-4">
                                            Resume <span className="font-editorial italic normal-case tracking-wide">& Credits</span>
                                        </h2>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 className="animate-spin w-8 h-8 text-accent" />
                                        <span className="font-body text-xs tracking-widest uppercase text-muted-foreground">Loading Resume...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-12">
                                        {/* Feature Films */}
                                        {films && films.length > 0 && (
                                            <motion.div
                                                initial="hidden" whileInView="visible" viewport={{ once: true }}
                                                variants={itemVariants} className="space-y-8"
                                            >
                                                <h3 className="font-editorial text-3xl italic border-l-2 border-accent pl-6">Feature Films</h3>
                                                <div className="grid gap-4">
                                                    {films.map((film) => (
                                                        <div key={film.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-secondary/10 hover:bg-secondary/30 border border-transparent hover:border-border/50 transition-all duration-300">
                                                            <div className="space-y-0.5">
                                                                <h4 className="font-display text-lg tracking-wide">{film.title}</h4>
                                                                {film.director && <p className="font-body text-[10px] text-muted-foreground tracking-wider uppercase">Dir. {film.director}</p>}
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                {film.role && <span className="font-editorial italic text-base text-accent">{film.role}</span>}
                                                                {film.year && <span className="font-body text-xs font-bold opacity-30">{film.year}</span>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* TV & Theater */}
                                        {((tvShows && tvShows.length > 0) || (theater && theater.length > 0)) && (
                                            <div className="grid md:grid-cols-2 gap-12">
                                                {tvShows && tvShows.length > 0 && (
                                                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="space-y-8">
                                                        <h3 className="font-editorial text-2xl italic border-l-2 border-accent pl-6">Television</h3>
                                                        <div className="space-y-6">
                                                            {tvShows.map((show) => (
                                                                <div key={show.id} className="space-y-1 group">
                                                                    <div className="flex justify-between items-baseline">
                                                                        <h4 className="font-display text-lg">{show.show}</h4>
                                                                        {show.year && <span className="text-xs text-muted-foreground">{show.year}</span>}
                                                                    </div>
                                                                    <p className="text-sm text-foreground/80">
                                                                        {show.role}{show.channel && <><span className="text-muted-foreground mx-2">•</span>{show.channel}</>}
                                                                    </p>
                                                                    {show.link && (
                                                                        <a href={show.link} target="_blank" rel="noopener noreferrer" className="inline-block text-[10px] uppercase tracking-wider text-accent hover:underline mt-1">Watch Snippet</a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {theater && theater.length > 0 && (
                                                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="space-y-8">
                                                        <h3 className="font-editorial text-2xl italic border-l-2 border-accent pl-6">Theater</h3>
                                                        <div className="space-y-6">
                                                            {theater.map((play) => (
                                                                <div key={play.id} className="space-y-1">
                                                                    <div className="flex justify-between items-baseline">
                                                                        <h4 className="font-display text-lg">{play.play}</h4>
                                                                        {play.year && <span className="text-xs text-muted-foreground">{play.year}</span>}
                                                                    </div>
                                                                    <p className="text-sm text-foreground/80">
                                                                        {play.role}{play.theater && <><span className="text-muted-foreground mx-2">•</span>{play.theater}</>}
                                                                    </p>
                                                                    {play.director && <p className="text-xs text-muted-foreground font-light">Dir. {play.director}</p>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}

                                        {/* Skills & Education */}
                                        {((education && education.length > 0) || (training && training.length > 0)) && (
                                            <div className="grid md:grid-cols-2 gap-12">
                                                {education && education.length > 0 && (
                                                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="space-y-8">
                                                        <h3 className="font-editorial text-2xl italic border-l-2 border-accent pl-6">Education</h3>
                                                        <ul className="space-y-2">
                                                            {education.map((edu) => (
                                                                <li key={edu.id} className="font-body text-sm">{edu.degree}</li>
                                                            ))}
                                                        </ul>
                                                    </motion.div>
                                                )}

                                                {training && training.length > 0 && (
                                                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="space-y-8">
                                                        <h3 className="font-editorial text-2xl italic border-l-2 border-accent pl-6">Acting Training</h3>
                                                        <div className="space-y-4">
                                                            {training.map((t) => (
                                                                <div key={t.id}>
                                                                    <p className="font-display text-sm">{t.school}</p>
                                                                    {(t.mentor || t.location) && (
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {[t.mentor, t.location].filter(Boolean).join(" • ")}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}

                                        {/* Commercials */}
                                        {commercials && commercials.length > 0 && (
                                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="space-y-6 pb-12">
                                                <div className="flex items-baseline justify-between border-b border-border/50 pb-4">
                                                    <h3 className="font-editorial text-2xl italic">Commercials</h3>
                                                    <span className="text-[10px] text-muted-foreground font-body tracking-wider uppercase">Selected Brands from 500+ Projects</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {commercials.map((c) => (
                                                        <span key={c.id} className="px-3 py-1.5 bg-secondary/30 border border-border/50 text-[10px] tracking-wide hover:bg-accent hover:text-white transition-colors cursor-default uppercase">
                                                            {c.brand}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ResumeSheet;
