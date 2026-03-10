import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
    onLoadingComplete: () => void;
}

const Preloader = ({ onLoadingComplete }: PreloaderProps) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setIsComplete(true), 500);
                    setTimeout(() => onLoadingComplete(), 2000);
                    return 100;
                }
                const diff = Math.random() * 15;
                return Math.min(prev + diff, 100);
            });
        }, 120);

        return () => clearInterval(timer);
    }, [onLoadingComplete]);

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
                    }}
                    className="fixed inset-0 z-[10000] bg-primary flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Background Texture/Grain can be added here */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center">
                        {/* Progress Number */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12"
                        >
                            <span className="font-editorial italic text-6xl md:text-8xl text-accent/40 block">
                                {Math.round(progress)}
                                <span className="text-2xl ml-2 font-body not-italic tracking-widest">%</span>
                            </span>
                        </motion.div>

                        {/* Name Reveal */}
                        <div className="overflow-hidden py-2">
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
                                className="font-display text-4xl md:text-6xl lg:text-8xl tracking-[0.2em] uppercase text-white leading-none"
                            >
                                Ankith <span className="font-editorial italic normal-case text-accent">Madhav</span>
                            </motion.h1>
                        </div>

                        {/* Decorative Line */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                            className="h-px w-24 bg-accent/30 mt-8"
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            transition={{ delay: 1 }}
                            className="font-body text-[10px] tracking-[0.4em] uppercase text-white mt-4"
                        >
                            The Panache Factor
                        </motion.p>
                    </div>

                    {/* Splitting Panels for reveal */}
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={progress === 100 ? { scaleY: 1 } : { scaleY: 0 }}
                        className="absolute inset-0 bg-background z-20 origin-bottom"
                        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.8 }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
