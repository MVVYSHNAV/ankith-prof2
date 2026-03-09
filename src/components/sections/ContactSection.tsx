import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Instagram, Mail, ArrowUpRight, ExternalLink } from "lucide-react";

const ContactSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { name, email, subject, message } = formData;
        const mailtoLink = `mailto:unnikrishnan27@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;

        window.location.href = mailtoLink;

        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <>
            <section id="contact" ref={sectionRef} className="py-32 md:py-40 section-padding bg-primary transition-colors duration-500 text-primary-foreground">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
                        {/* Left - Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="font-body text-xs tracking-[0.4em] uppercase text-primary-foreground/50">
                                Contact
                            </span>
                            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.05em] uppercase mt-4">
                                Let's
                                <br />
                                <span className="font-editorial italic font-light normal-case tracking-wide">
                                    Work Together
                                </span>
                            </h2>

                            <div className="mt-16 space-y-6">
                                <a
                                    href="mailto:unnikrishnan27@gmail.com"
                                    className="flex items-center gap-4 group"
                                >
                                    <Mail size={18} strokeWidth={1} className="text-accent" />
                                    <span className="font-body text-sm tracking-[0.15em] text-primary-foreground/70 group-hover:text-primary-foreground transition-colors">
                                        unnikrishnan27@gmail.com
                                    </span>
                                </a>
                                <a
                                    href="https://www.instagram.com/ankithmadhav/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 group"
                                >
                                    <Instagram size={18} strokeWidth={1} className="text-accent" />
                                    <span className="font-body text-sm tracking-[0.15em] text-primary-foreground/70 group-hover:text-primary-foreground transition-colors">
                                        @ankithmadhav
                                    </span>
                                </a>
                                <a
                                    href="https://en.wikipedia.org/wiki/Ankith_Madhav"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-[18px] h-[18px] flex items-center justify-center text-accent">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                            <path d="M12.09 5.262l3.35 13.402h-2.115l-1.98-7.502l-1.98 7.502H7.25l3.35-13.402h2.235h-1.735l-1.936 7.502l-1.935-7.502H5.159l3.35 13.402h2.115L12.604 11.26l1.98 7.502h2.115l3.35-13.402h-2.235l-2.025 8.932-2.025-8.932h-2.398z" />
                                        </svg>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-body text-sm tracking-[0.15em] text-primary-foreground/70 group-hover:text-primary-foreground transition-colors">
                                            Wikipedia
                                        </span>
                                        <ExternalLink size={12} className="text-primary-foreground/30 group-hover:text-accent transition-colors" />
                                    </div>
                                </a>
                                <a
                                    href="https://m.imdb.com/name/nm6840845/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-[18px] h-[18px] flex items-center justify-center text-accent">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                            <path d="M22.5 3H1.5C.672 3 0 3.672 0 4.5v15c0 .828.672 1.5 1.5 1.5h21c.828 0 1.5-.672 1.5-1.5v-15c0-.828-.672-1.5-1.5-1.5zM6.685 15.68h-1.5v-6h1.5v6zm3.743-6h1.5v6h-1.5v-4.5h-.743v4.5h-1.5v-6h1.5v1.5h.743v-1.5zm6.75 6h-3.75v-6h1.5v4.5h2.25v1.5zm3.75-1.5c0 .828-.672 1.5-1.5 1.5h-1.125v-6H19.5c.828 0 1.5.672 1.5 1.5v3z" />
                                        </svg>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-body text-sm tracking-[0.15em] text-primary-foreground/70 group-hover:text-primary-foreground transition-colors">
                                            IMDb Profile
                                        </span>
                                        <ExternalLink size={12} className="text-primary-foreground/30 group-hover:text-accent transition-colors" />
                                    </div>
                                </a>
                            </div>

                            <div className="mt-16">
                                <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary-foreground/40 block mb-4">
                                    Quote
                                </span>
                                <span className="font-editorial text-lg text-primary-foreground/60 italic">
                                    "I always want the audience to outguess me, and then I double-cross them."
                                </span>
                            </div>
                        </motion.div>

                        {/* Right - Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label className="font-body text-[10px] tracking-[0.4em] uppercase text-primary-foreground/50 block mb-3">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={100}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-transparent border-b border-primary-foreground/20 focus:border-accent pb-3 font-editorial text-lg text-primary-foreground outline-none transition-colors placeholder:text-primary-foreground/20"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="font-body text-[10px] tracking-[0.4em] uppercase text-primary-foreground/50 block mb-3">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        maxLength={255}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-transparent border-b border-primary-foreground/20 focus:border-accent pb-3 font-editorial text-lg text-primary-foreground outline-none transition-colors placeholder:text-primary-foreground/20"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="font-body text-[10px] tracking-[0.4em] uppercase text-primary-foreground/50 block mb-3">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={200}
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full bg-transparent border-b border-primary-foreground/20 focus:border-accent pb-3 font-editorial text-lg text-primary-foreground outline-none transition-colors placeholder:text-primary-foreground/20"
                                        placeholder="Booking / Collaboration"
                                    />
                                </div>

                                <div>
                                    <label className="font-body text-[10px] tracking-[0.4em] uppercase text-primary-foreground/50 block mb-3">
                                        Message
                                    </label>
                                    <textarea
                                        required
                                        maxLength={1000}
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-transparent border-b border-primary-foreground/20 focus:border-accent pb-3 font-editorial text-lg text-primary-foreground outline-none transition-colors resize-none placeholder:text-primary-foreground/20"
                                        placeholder="Tell me about your project..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="group flex items-center gap-3 font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/70 hover:text-primary-foreground border-b border-primary-foreground/30 hover:border-accent pb-2 transition-all duration-300 mt-4"
                                >
                                    {isSubmitted ? "Message Sent" : "Send Message"}
                                    <ArrowUpRight
                                        size={14}
                                        strokeWidth={1.5}
                                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                                    />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 md:py-16 section-padding bg-background text-foreground border-t border-border">
                <div className="max-w-7xl mx-auto flex flex-col gap-8">
                    {/* Footer Nav */}
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
                        <a href="#" className="font-body text-xs tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground transition-colors">Home</a>
                        <a href="#about" className="font-body text-xs tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground transition-colors">About</a>
                        <a href="#filmography" className="font-body text-xs tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground transition-colors">Filmography</a>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-4 border-t border-border/40">
                        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground text-center sm:text-left">
                            © 2026. All Rights Reserved to Ankith Madhav
                        </span>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default ContactSection;
