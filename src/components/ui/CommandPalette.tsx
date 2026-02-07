import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Code, Mail, User, Briefcase, Film, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    const navTo = (href: string) => {
        if (href.startsWith("#")) {
            const element = document.querySelector(href);
            element?.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate(href);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4"
                    onClick={() => setOpen(false)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="w-full max-w-lg shadow-2xl rounded-xl overflow-hidden border border-border bg-popover"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Command className="w-full">
                            <div className="flex items-center border-b border-border px-4" cmdk-input-wrapper="">
                                <Search className="w-5 h-5 text-muted-foreground mr-2" />
                                <Command.Input
                                    placeholder="Type a command or search..."
                                    className="w-full h-14 bg-transparent outline-none text-foreground placeholder:text-muted-foreground font-body text-sm"
                                />
                            </div>
                            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                                    No results found.
                                </Command.Empty>

                                <Command.Group heading="Navigation" className="text-xs font-bold text-muted-foreground mb-2 px-2">
                                    <Command.Item
                                        className="flex items-center gap-2 px-2 py-2 text-sm text-foreground rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors"
                                        onSelect={() => runCommand(() => navTo("#about"))}
                                    >
                                        <User className="w-4 h-4" />
                                        <span>About</span>
                                    </Command.Item>
                                    <Command.Item
                                        className="flex items-center gap-2 px-2 py-2 text-sm text-foreground rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors"
                                        onSelect={() => runCommand(() => navTo("#portfolio"))}
                                    >
                                        <Briefcase className="w-4 h-4" />
                                        <span>Portfolio</span>
                                    </Command.Item>
                                    <Command.Item
                                        className="flex items-center gap-2 px-2 py-2 text-sm text-foreground rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors"
                                        onSelect={() => navTo("#filmography")} // Assuming this exists or will exist
                                    >
                                        <Film className="w-4 h-4" />
                                        <span>Filmography</span>
                                    </Command.Item>
                                    <Command.Item
                                        className="flex items-center gap-2 px-2 py-2 text-sm text-foreground rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors"
                                        onSelect={() => runCommand(() => navTo("#contact"))}
                                    >
                                        <Mail className="w-4 h-4" />
                                        <span>Contact</span>
                                    </Command.Item>
                                </Command.Group>

                                <Command.Group heading="Actions" className="text-xs font-bold text-muted-foreground mb-2 px-2 mt-2">
                                    <Command.Item
                                        className="flex items-center gap-2 px-2 py-2 text-sm text-foreground rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors"
                                        onSelect={() => runCommand(() => window.open("/resume.pdf", "_blank"))}
                                    >
                                        <FileText className="w-4 h-4" />
                                        <span>View Resume</span>
                                    </Command.Item>
                                    <Command.Item
                                        className="flex items-center gap-2 px-2 py-2 text-sm text-foreground rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors"
                                        onSelect={() => runCommand(() => window.open("https://github.com", "_blank"))}
                                    >
                                        <Code className="w-4 h-4" />
                                        <span>GitHub</span>
                                    </Command.Item>
                                </Command.Group>
                            </Command.List>
                            <div className="border-t border-border p-2 flex items-center justify-end">
                                <span className="text-[10px] text-muted-foreground">
                                    Use <kbd className="bg-muted px-1 rounded text-foreground">↑</kbd> <kbd className="bg-muted px-1 rounded text-foreground">↓</kbd> to navigate, <kbd className="bg-muted px-1 rounded text-foreground">↵</kbd> to select
                                </span>
                            </div>
                        </Command>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
