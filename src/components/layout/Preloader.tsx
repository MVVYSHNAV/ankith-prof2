import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
    onLoadingComplete: () => void;
}

const words = [
    "Panache",
    "Ankith Madhav"
];

const Preloader = ({ onLoadingComplete }: PreloaderProps) => {
    const [index, setIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (index === words.length - 1) {
            setTimeout(() => {
                setIsComplete(true);
                setTimeout(onLoadingComplete, 1000);
            }, 1000);
            return;
        }

        const timer = setTimeout(() => {
            setIndex((prev) => prev + 1);
        }, index === 0 ? 1000 : 150);

        return () => clearTimeout(timer);
    }, [index, onLoadingComplete]);

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        y: "-100%",
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }}
                    className="fixed inset-0 z-[10000] bg-primary flex flex-col items-center justify-center overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center">
                        <div className="h-20 md:h-32 overflow-hidden flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={words[index]}
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "-100%" }}
                                    transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                                    className={`font-display text-4xl md:text-6xl lg:text-8xl tracking-[0.2em] uppercase text-white leading-none ${index === words.length - 1 ? "text-accent" : ""}`}
                                >
                                    {words[index]}
                                </motion.span>
                            </AnimatePresence>
                        </div>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                            className="h-px w-24 bg-accent/30 mt-8"
                        />
                    </div>

                    {/* Reveal background panels */}
                    <div className="absolute inset-0 flex flex-col pointer-events-none">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scaleY: 0 }}
                                animate={isComplete ? { scaleY: 1 } : { scaleY: 0 }}
                                className="flex-1 bg-background origin-top"
                                transition={{
                                    duration: 0.6,
                                    ease: [0.76, 0, 0.24, 1],
                                    delay: i * 0.1
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
