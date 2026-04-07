import { useState, forwardRef, useEffect } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";


interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  fallbackSrc?: string;
  priority?: boolean;
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio,
  objectFit = "cover",
  priority = false,
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
    <div className={cn(
      "relative bg-muted/20",
      aspectRatio ? "overflow-hidden" : "w-full",
      aspectRatio,
      containerClassName
    )}>
      {/* Placeholder / Blur Effect */}
      {!isLoaded && !hasError && (
        <div className={cn(
          "animate-pulse bg-muted/40",
          (aspectRatio || containerClassName?.includes("h-")) ? "absolute inset-0" : "w-full aspect-video"
        )} />
      )}

      {/* Actual Image */}
      <img
        ref={ref}
        src={hasError ? "/placeholder.svg" : src}
        alt={alt}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setHasError(true);
          setIsLoaded(true);
          onError?.(e);
        }}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn(
          "transition-all duration-700 ease-out",
          (aspectRatio || containerClassName?.includes("h-") || containerClassName?.includes("absolute")) 
            ? "absolute inset-0 w-full h-full" 
            : "w-full h-auto block",
          objectFit === "cover" ? "object-cover" : 
          objectFit === "contain" ? "object-contain" : 
          objectFit === "fill" ? "object-fill" : 
          objectFit === "scale-down" ? "object-scale-down" : "object-none",
          isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-sm",
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
