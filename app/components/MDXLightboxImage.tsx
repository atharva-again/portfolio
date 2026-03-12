"use client";

import Image from "next/image";
import type { ImageProps, StaticImageData } from "next/image";
import { useState, useEffect, useRef } from "react";
import { useLightbox } from "./LightboxProvider";

type MDXLightboxImageProps = Omit<ImageProps, "src" | "alt" | "className"> & {
  src: string | StaticImageData;
  alt?: string;
  className?: string;
};

export function MDXLightboxImage({ src, alt, className, ...props }: MDXLightboxImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { openLightboxAtId, registerImage, unregisterImage } = useLightbox();
  const idRef = useRef<number | null>(null);

  useEffect(() => {
    // register on mount
    const id = registerImage({ src, alt: alt || "" });
    idRef.current = id;
    return () => {
      // unregister on unmount
      if (idRef.current !== null) unregisterImage(idRef.current);
    };
  }, [src, alt, registerImage, unregisterImage]);

  const handleClick = () => {
    if (idRef.current !== null) {
      openLightboxAtId(idRef.current);
    }
  };

  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const imgWrapperRef = useRef<HTMLButtonElement | null>(null);

  const handleWrapperMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="relative w-full my-6 group flex justify-center">
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse aspect-video" />
      )}

      {/* Image wrapper: attach pointer handlers here so tooltip only appears when hovering the image itself */}
      <button
        type="button"
        ref={imgWrapperRef}
        className="relative inline-block"
        onMouseMove={handleWrapperMouseMove}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
      >
        <Image
          src={src}
          alt={alt || ""}
          width={800}
          height={450}
          className={`w-auto h-auto rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity ${className || ""}`}
          quality={100}
          onLoad={() => setIsLoading(false)}
          {...props}
        />

        {/* Cursor-following tooltip placed inside the wrapper so it cannot appear outside the image bounds */}
        <div
          aria-hidden="true"
          className={`hidden sm:block pointer-events-none absolute px-2 py-1 rounded-full bg-black/70 text-white text-xs transition-opacity duration-150 ${
            showTooltip ? 'opacity-100' : 'opacity-0'
          }`
          }
          style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, -120%)' }}
        >
          Click to enlarge
        </div>
      </button>
    </div>
  );
}
