"use client";

import * as React from "react";
import { optimizeImage } from "@/lib/image-cdn";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  optimizeWidth?: number;
}

/**
 * SafeImage tries to render an optimized CDN URL thumbnail first.
 * If the CDN optimization fails (e.g., ImageKit unsigned transformations restricted,
 * network issue, or unsupported parameter), it automatically falls back to the original `src`.
 */
export function SafeImage({
  src,
  optimizeWidth = 500,
  alt,
  className,
  onError,
  ...props
}: SafeImageProps) {
  const optimized = React.useMemo(() => {
    return optimizeWidth && src ? optimizeImage(src, optimizeWidth) : src;
  }, [src, optimizeWidth]);

  const [currentSrc, setCurrentSrc] = React.useState(optimized);

  React.useEffect(() => {
    setCurrentSrc(optimized);
  }, [optimized]);

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        if (currentSrc !== src) {
          setCurrentSrc(src);
        }
        if (onError) onError(e);
      }}
    />
  );
}
