import { useState, forwardRef, useEffect } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";


interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  fallbackSrc?: string;
  priority?: boolean;
  aspectRatio?: string;
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio = "aspect-square",
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
    <div className={cn("relative overflow-hidden bg-muted/20", aspectRatio, containerClassName)}>
      {/* Placeholder / Blur Effect */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-muted/40" />
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
          "w-full h-full object-cover transition-all duration-700 ease-out",
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
