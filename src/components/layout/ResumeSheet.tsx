import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import resumeData from "@/data/resume.json";
import { Download, X } from "lucide-react";

interface ResumeSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

const ResumeSheet = ({ isOpen, onClose }: ResumeSheetProps) => {
    // Prevent body scroll when sheet is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
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
                                    <a
                                        href="/Ankith_Resume.pdf"
                                        download
                                        className="w-fit group flex items-center gap-3 px-6 py-3 bg-foreground text-background font-body text-xs tracking-widest uppercase hover:bg-accent hover:text-foreground transition-all duration-300"
                                    >
                                        <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
                                        Download Resume
                                    </a>
                                </div>

                                {/* Personal Stats Grid */}
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-6 bg-secondary/20 border border-border/30">
                                    {Object.entries(resumeData.personalDetails).map(([key, value]) => (
                                        <div key={key} className="space-y-1">
                                            <span className="block font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                            <span className="block font-display text-base tracking-wide">
                                                {Array.isArray(value) ? value.join(", ") : value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Content Columns */}
                                <div className="space-y-12">
                                    {/* Films */}
                                    <motion.div
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={itemVariants}
                                        className="space-y-8"
                                    >
                                        <h3 className="font-editorial text-3xl italic border-l-2 border-accent pl-6">Feature Films</h3>
                                        <div className="grid gap-4">
                                            {resumeData.films.map((film, index) => (
                                                <div key={index} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-secondary/10 hover:bg-secondary/30 border border-transparent hover:border-border/50 transition-all duration-300">
                                                    <div className="space-y-0.5">
                                                        <h4 className="font-display text-lg tracking-wide">{film.title}</h4>
                                                        <p className="font-body text-[10px] text-muted-foreground tracking-wider uppercase">Dir. {film.director}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-editorial italic text-base text-accent">{film.role}</span>
                                                        <span className="font-body text-xs font-bold opacity-30">{film.year}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* TV & Theater */}
                                    <div className="grid md:grid-cols-2 gap-12">
                                        <motion.div
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            variants={itemVariants}
                                            className="space-y-8"
                                        >
                                            <h3 className="font-editorial text-2xl italic border-l-2 border-accent pl-6">Television</h3>
                                            <div className="space-y-6">
                                                {resumeData.tv.map((show, index) => (
                                                    <div key={index} className="space-y-1 group">
                                                        <div className="flex justify-between items-baseline">
                                                            <h4 className="font-display text-lg">{show.show}</h4>
                                                            <span className="text-xs text-muted-foreground">{show.year}</span>
                                                        </div>
                                                        <p className="text-sm text-foreground/80">{show.role} <span className="text-muted-foreground mx-2">•</span> {show.channel}</p>
                                                        {show.link && (
                                                            <a href={show.link} target="_blank" rel="noopener noreferrer" className="inline-block text-[10px] uppercase tracking-wider text-accent hover:underline mt-1">Watch Snippet</a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            variants={itemVariants}
                                            className="space-y-8"
                                        >
                                            <h3 className="font-editorial text-2xl italic border-l-2 border-accent pl-6">Theater</h3>
                                            <div className="space-y-6">
                                                {resumeData.theater.map((play, index) => (
                                                    <div key={index} className="space-y-1">
                                                        <div className="flex justify-between items-baseline">
                                                            <h4 className="font-display text-lg">{play.play}</h4>
                                                            <span className="text-xs text-muted-foreground">{play.year}</span>
                                                        </div>
                                                        <p className="text-sm text-foreground/80">{play.role} <span className="text-muted-foreground mx-2">•</span> {play.theater}</p>
                                                        <p className="text-xs text-muted-foreground font-light">Dir. {play.director}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Skills & Education */}
                                    <div className="grid md:grid-cols-2 gap-12">
                                        <motion.div
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            variants={itemVariants}
                                            className="p-8 bg-foreground text-background"
                                        >
                                            <h3 className="font-display text-lg uppercase tracking-widest mb-6">Special Skills</h3>
                                            <ul className="space-y-3">
                                                {resumeData.specialSkills.map((skill, index) => (
                                                    <li key={index} className="font-body text-sm tracking-wide flex items-start gap-3 opacity-90">
                                                        <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                                                        {skill}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>

                                        <motion.div
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            variants={itemVariants}
                                            className="space-y-8"
                                        >
                                            <h3 className="font-editorial text-2xl italic border-l-2 border-accent pl-6">Education</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-display text-xs tracking-widest uppercase mb-2 text-muted-foreground">Academic</h4>
                                                    <ul className="space-y-1">
                                                        {resumeData.education.map((edu, index) => (
                                                            <li key={index} className="font-body text-sm">{edu}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="pt-4 border-t border-border/50">
                                                    <h4 className="font-display text-xs tracking-widest uppercase mb-2 text-muted-foreground">Training</h4>
                                                    {resumeData.actingTraining.map((train, index) => (
                                                        <div key={index}>
                                                            <p className="font-display text-sm">{train.school}</p>
                                                            <p className="text-xs text-muted-foreground">{train.mentor} • {train.location}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Commercials */}
                                    <motion.div
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={itemVariants}
                                        className="space-y-6 pb-12"
                                    >
                                        <div className="flex items-baseline justify-between border-b border-border/50 pb-4">
                                            <h3 className="font-editorial text-2xl italic">Commercials</h3>
                                            <span className="text-[10px] text-muted-foreground font-body tracking-wider uppercase">Selected Brands from 500+ Projects</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {resumeData.commercials.map((ad, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1.5 bg-secondary/30 border border-border/50 text-[10px] tracking-wide hover:bg-accent hover:text-white transition-colors cursor-default uppercase"
                                                >
                                                    {ad}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ResumeSheet;
