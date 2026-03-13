import { useState, forwardRef, useEffect } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface OptimizedImageProps extends HTMLMotionProps<"img"> {
  containerClassName?: string;
  fallbackSrc?: string;
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({
  src,
  alt,
  className,
  containerClassName,
  fallbackSrc = "/placeholder.svg",
  onLoad,
  onError,
  ...props
}, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden w-full h-full", containerClassName)}>
      {/* Placeholder / Shimmer */}
      <AnimatePresence mode="wait">
        {!isLoaded && !hasError && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 z-10"
          >
            <Skeleton className="w-full h-full rounded-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Image */}
      <motion.img
        ref={ref}
        src={hasError ? fallbackSrc : src}
        alt={alt}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.05
        }}
        transition={{
          opacity: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
        }}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setHasError(true);
          setIsLoaded(true); // Set to true to hide placeholder and show fallback
          onError?.(e);
        }}
        className={cn(
          "w-full h-full object-cover will-change-transform",
          className
        )}
        {...props}
      />

      {/* Fallback for error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">Image unavailable</span>
        </div>
      )}
    </div>
  );
});

export default OptimizedImage;
