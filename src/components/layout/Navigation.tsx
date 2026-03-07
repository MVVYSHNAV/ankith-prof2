import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";
import ResumeSheet from "@/components/layout/ResumeSheet";

const navItems = [
    { label: "About", href: "#about" },
    { label: "Filmography", href: "#filmography" },
    { label: "Contact", href: "#contact" },
];

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5, ease: [0.33, 1, 0.68, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? "bg-background/80 backdrop-blur-lg border-b border-primary/10 text-foreground"
                    : "bg-transparent text-foreground"
                    }`}
            >
                <div className="flex items-center justify-between section-padding py-5">
                    <a href="#" className="font-display text-lg tracking-[0.2em] uppercase text-foreground">
                        Ankith
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="relative font-body text-xs tracking-[0.3em] uppercase transition-colors duration-300 text-foreground/70 hover:text-foreground"
                            >
                                {item.label}
                                <span className="absolute bottom-0 left-0 w-full h-px origin-bottom-right transition-transform duration-300 scale-x-0 bg-accent" />
                            </a>
                        ))}
                        <button
                            onClick={() => setIsResumeOpen(true)}
                            className="font-body text-xs tracking-[0.3em] uppercase transition-colors duration-300 text-foreground/70 hover:text-foreground"
                        >
                            Resume
                        </button>
                        <ModeToggle />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        aria-label="Toggle menu"
                    >
                        <motion.span
                            animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                            className="block w-6 h-px bg-foreground"
                        />
                        <motion.span
                            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="block w-6 h-px bg-foreground"
                        />
                        <motion.span
                            animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                            className="block w-6 h-px bg-foreground"
                        />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-12"
                    >
                        {navItems.map((item, i) => (
                            <motion.a
                                key={item.label}
                                href={item.href}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 30 }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="font-display text-3xl tracking-[0.15em] uppercase text-foreground hover:text-accent transition-colors"
                            >
                                {item.label}
                            </motion.a>
                        ))}
                        <motion.button
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ delay: navItems.length * 0.1, duration: 0.4 }}
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsResumeOpen(true);
                            }}
                            className="font-display text-3xl tracking-[0.15em] uppercase text-foreground hover:text-accent transition-colors"
                        >
                            Resume
                        </motion.button>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ delay: (navItems.length + 1) * 0.1, duration: 0.4 }}
                        >
                            <ModeToggle />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ResumeSheet isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
        </>
    );
};

export default Navigation;
