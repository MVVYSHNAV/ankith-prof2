import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Instagram, Mail, ArrowUpRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof formSchema>;

const ContactSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: ContactFormValues) => {
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log(data);
            setIsSubmitting(false);
            setIsSuccess(true);
            toast("Message sent successfully!", {
                description: "I'll get back to you as soon as possible.",
            });
            reset();

            // Reset success state after a few seconds
            setTimeout(() => setIsSuccess(false), 3000);
        }, 1500);
    };

    return (
        <section id="contact" ref={sectionRef} className="py-32 section-padding bg-secondary/20 border-t border-border">
            <div className="max-w-xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground">
                        Get in Touch
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl mt-4">
                        Let's <span className="italic font-editorial">Collaborate</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Name
                            </label>
                            <input
                                id="name"
                                className="flex h-12 w-full rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-accent"
                                placeholder="Your name"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-sm font-medium text-destructive animate-pulse">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="flex h-12 w-full rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-accent"
                                placeholder="your.email@example.com"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm font-medium text-destructive animate-pulse">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Message
                            </label>
                            <textarea
                                id="message"
                                className="flex min-h-[120px] w-full rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all focus:border-accent"
                                placeholder="Tell me about your project..."
                                {...register("message")}
                            />
                            {errors.message && (
                                <p className="text-sm font-medium text-destructive animate-pulse">{errors.message.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || isSuccess}
                            className={`w-full h-12 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest ${isSuccess
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                                }`}
                        >
                            {isSubmitting ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                                />
                            ) : isSuccess ? (
                                <motion.span
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex items-center gap-2"
                                >
                                    Sent Successfully
                                </motion.span>
                            ) : (
                                "Send Message"
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Footer Info */}
                <div className="mt-16 space-y-6 text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between gap-8 items-center md:items-start text-sm text-muted-foreground/80">
                        <div className="flex flex-col gap-2">
                            <span className="font-bold text-foreground">Contact Info</span>
                            <a href="mailto:infogetintouch@gmail.com" className="hover:text-accent transition-colors">infogetintouch@gmail.com</a>
                            <span>+91 99 99 99 9999</span>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></a>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border flex justify-center md:justify-between text-xs text-muted-foreground/50 uppercase tracking-wider">
                        <span>© 2025 Ankith Madhav</span>
                        <span className="hidden md:inline">Design by [Your Name]</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
