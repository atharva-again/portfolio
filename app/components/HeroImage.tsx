"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import type { StaticImageData } from "next/image";
import { useLightbox } from "./LightboxProvider";

interface HeroImageProps {
  src: string | StaticImageData;
  alt: string;
  enableLightbox?: boolean;
}

export default function HeroImage({ src, alt, enableLightbox = true }: HeroImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { openLightboxAtId, registerImage, unregisterImage } = useLightbox();
  const idRef = useRef<number | null>(null);

  useEffect(() => {
    if (enableLightbox) {
      const id = registerImage({ src, alt });
      idRef.current = id;
      return () => {
        if (idRef.current !== null) unregisterImage(idRef.current);
      };
    }
  }, [src, alt, registerImage, unregisterImage, enableLightbox]);

  const handleClick = () => {
    if (enableLightbox && idRef.current !== null) openLightboxAtId(idRef.current);
  };

  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      className="mb-12 relative group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" style={{ height: '500px' }} />
      )}
      <Image
        src={src}
        alt={alt}
        width={800}
        height={500}
        className={`w-full h-auto rounded-lg object-cover transition-opacity ${enableLightbox ? 'cursor-pointer hover:opacity-90' : ''}`}
        priority
        quality={100}
        onLoad={() => setIsLoading(false)}
        onClick={handleClick}
      />
      {/* Cursor-following tooltip for pointer devices (hidden on small/touch) */}
      {enableLightbox && (
        <div
          aria-hidden="true"
          className={`hidden sm:block pointer-events-none absolute px-2 py-1 rounded-full bg-black/70 text-white text-xs transition-opacity duration-150 ${
            showTooltip ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, -120%)' }}
        >
          Click to open
        </div>
      )}
    </div>
  );
}
