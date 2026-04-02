import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";
import ResumeSheet from "@/components/layout/ResumeSheet";
import { useProfile } from "@/hooks/useSupabase";

const navItems = [
    { label: "About", href: "#about" },
    { label: "Filmography", href: "#filmography" },
    { label: "Contact", href: "#contact" },
];

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const { data: profile } = useProfile();

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
                <div className="flex items-center justify-between section-padding py-5 px-6">
                    <motion.a
                        href="#"
                        animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                        transition={{ duration: 0.3 }}
                        className="font-display text-lg tracking-[0.2em] uppercase text-foreground"
                    >
                        {profile?.name || "Ankith"}
                    </motion.a>

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
                        className="md:hidden flex flex-col gap-1.5 p-2 z-50"
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
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                        className="fixed inset-0 z-40 bg-background flex flex-col overflow-hidden"
                    >
                        {/* Decorative Background Text */}
                        <motion.div
                            initial={{ opacity: 0, x: 100, rotate: -90 }}
                            animate={{ opacity: 0.05, x: "25%", rotate: -90 }}
                            transition={{ duration: 1.2, delay: 0.2 }}
                            className="absolute top-1/2 -right-20 pointer-events-none select-none"
                        >
                            <span className="font-editorial italic text-[20vh] tracking-tighter uppercase whitespace-nowrap">
                                {profile?.name || "Ankith"}
                            </span>
                        </motion.div>

                        {/* Mobile Menu Body */}
                        <div className="flex-1 flex flex-col justify-center section-padding space-y-12 relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <span className="font-body text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-10 block opacity-50">
                                    Menu
                                </span>
                                <div className="flex flex-col gap-10">
                                    {navItems.map((item, i) => (
                                        <motion.a
                                            key={item.label}
                                            href={item.href}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="group flex items-baseline gap-6"
                                        >
                                            <span className="font-display text-5xl tracking-tight uppercase text-foreground hover:text-accent transition-colors duration-300">
                                                {item.label}
                                            </span>
                                        </motion.a>
                                    ))}
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + navItems.length * 0.1, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsResumeOpen(true);
                                        }}
                                        className="text-left group flex items-baseline gap-6"
                                    >
                                        <span className="font-display text-5xl tracking-tight uppercase text-foreground hover:text-accent transition-colors duration-300">
                                            Resume
                                        </span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Mobile Menu Footer */}
                        <div className="section-padding py-12 border-t border-foreground/5 bg-foreground/[0.02] relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex items-center justify-between"
                            >
                                <div className="space-y-3">
                                    <span className="block font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground opacity-50">
                                        Appearance
                                    </span>
                                    <ModeToggle />
                                </div>
                                <div className="flex flex-col items-end gap-3 text-right">
                                    <a
                                        href="/khullja-sim-sim"
                                        className="block font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground opacity-40 hover:opacity-100 transition-opacity"
                                    >
                                        {profile?.name || "Ankith"}
                                    </a>
                                    <span className="font-editorial italic text-xs text-muted-foreground">
                                        {profile?.about_quote || "The Panache Factor"}
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ResumeSheet isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
        </>
    );
};

export default Navigation;
