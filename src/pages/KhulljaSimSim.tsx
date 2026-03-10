import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const KhulljaSimSim = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [textVisible, setTextVisible] = useState(true);

    useEffect(() => {
        // Start the "magic" after a short delay
        const timer = setTimeout(() => {
            setTextVisible(false);
            setIsOpen(true);
        }, 2000);

        // Redirect after animation completes
        const redirectTimer = setTimeout(() => {
            navigate("/panache");
        }, 4500);

        return () => {
            clearTimeout(timer);
            clearTimeout(redirectTimer);
        };
    }, [navigate]);

    return (
        <div className="fixed inset-0 bg-background overflow-hidden flex items-center justify-center z-[9999]">
            {/* The Text Reveal */}
            <AnimatePresence>
                {textVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute z-50 text-center"
                    >
                        <h1 className="font-display text-5xl md:text-8xl tracking-[0.2em] uppercase text-accent drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                            Khullja <span className="font-editorial italic normal-case">Sim Sim</span>
                        </h1>
                        <p className="font-body text-[10px] tracking-[0.5em] uppercase opacity-40 mt-6">
                            Opening the Panache Vault
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Door */}
            <motion.div
                initial={{ x: 0 }}
                animate={isOpen ? { x: "-100%" } : { x: 0 }}
                transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1], delay: 0.5 }}
                className="absolute top-0 left-0 w-1/2 h-full bg-primary border-r border-accent/20 z-40 flex flex-col items-end justify-center overflow-hidden"
            >
                <div className="pr-4 opacity-5">
                    <span className="font-display text-[20vh] rotate-90 whitespace-nowrap uppercase tracking-tighter">AN</span>
                </div>
            </motion.div>

            {/* Right Door */}
            <motion.div
                initial={{ x: 0 }}
                animate={isOpen ? { x: "100%" } : { x: 0 }}
                transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1], delay: 0.5 }}
                className="absolute top-0 right-0 w-1/2 h-full bg-primary border-l border-accent/20 z-40 flex flex-col items-start justify-center overflow-hidden"
            >
                <div className="pl-4 opacity-5">
                    <span className="font-display text-[20vh] rotate-90 whitespace-nowrap uppercase tracking-tighter">KITH</span>
                </div>
            </motion.div>

            {/* Background Content (Peeking through) */}
            <div className="absolute inset-0 bg-background flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="text-center"
                >
                    <div className="w-16 h-16 border border-accent/30 rounded-full flex items-center justify-center mb-8 animate-pulse">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default KhulljaSimSim;
