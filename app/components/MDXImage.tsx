"use client";

import Image from "next/image";
import { useState } from "react";
import { useLightbox } from "./LightboxProvider";

interface MDXImageProps {
  src?: string;
  alt?: string;
  className?: string;
  [key: string]: any;
}

const merge = (...values: Array<string | undefined>) =>
  values.filter(Boolean).join(" ");

export function MDXImage({ src, alt, className, ...props }: MDXImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { openLightbox } = useLightbox();

  const handleClick = () => {
    if (src) {
      openLightbox([{ src, alt: alt || "" }]);
    }
  };

  return (
    <div className="relative w-full my-6">
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse aspect-video" />
      )}
      <Image
        src={src || ""}
        alt={alt || ""}
        width={800}
        height={450}
        className={merge("w-full h-auto rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity", className)}
        quality={100}
        onLoad={() => setIsLoading(false)}
        onClick={handleClick}
        {...props}
      />
    </div>
  );
}
