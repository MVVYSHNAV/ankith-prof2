import { MoonStar, SunMedium } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const options = [
        { id: "light", icon: SunMedium, label: "Light" },
        { id: "dark", icon: MoonStar, label: "Dark" },
    ]

    return (
        <div className="flex items-center p-1 rounded-full bg-foreground/5 border border-foreground/10 backdrop-blur-md w-fit">
            {options.map((option) => {
                const Icon = option.icon
                const isActive = theme === option.id

                return (
                    <button
                        key={option.id}
                        onClick={() => setTheme(option.id as any)}
                        className={cn(
                            "relative p-2 rounded-full transition-colors duration-300 group",
                            isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                        title={option.label}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-theme-bg"
                                className="absolute inset-0 bg-background rounded-full shadow-sm z-0"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <Icon className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                        <span className="sr-only">{option.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
