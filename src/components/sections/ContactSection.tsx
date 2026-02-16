import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Instagram, Mail, ArrowUpRight } from "lucide-react";

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
        <section id="contact" ref={sectionRef} className="py-32 md:py-40 section-padding bg-primary dark:bg-background transition-colors duration-500 text-primary-foreground dark:text-foreground">
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

                        <p className="font-editorial text-xl text-primary-foreground/60 mt-8 max-w-md italic">
                            Feel free to contact me anytime. I will get back to you as soon as I can!
                        </p>

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
                            {/* <div className="flex items-center gap-4 group">
                                <span className="font-body text-sm tracking-[0.15em] text-primary-foreground/70">
                                    +91 99 99 99 9999
                                </span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <span className="font-body text-sm tracking-[0.15em] text-primary-foreground/70">
                                    19 SA Street, UK
                                </span>
                            </div> */}
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

                {/* Footer */}
                <div className="mt-32 pt-16 border-t border-primary-foreground/10 flex flex-col gap-8">
                    {/* Footer Nav */}
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
                        <a href="#" className="font-body text-xs tracking-[0.2em] uppercase text-primary-foreground/60 hover:text-primary-foreground transition-colors">Home</a>
                        <a href="#about" className="font-body text-xs tracking-[0.2em] uppercase text-primary-foreground/60 hover:text-primary-foreground transition-colors">About</a>
                        <a href="#career" className="font-body text-xs tracking-[0.2em] uppercase text-primary-foreground/60 hover:text-primary-foreground transition-colors">Career</a>
                        <a href="#filmography" className="font-body text-xs tracking-[0.2em] uppercase text-primary-foreground/60 hover:text-primary-foreground transition-colors">Filmography</a>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary-foreground/30 text-center sm:text-left">
                            © 2026. All Rights Reserved to Ankith Madhav
                        </span>
                        {/* <span className="font-editorial text-sm italic text-primary-foreground/30">
                            Available for Global Bookings
                        </span> */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
