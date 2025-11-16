
"use client";

import Image from "next/image";
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
  const { openLightbox } = useLightbox();

  const handleClick = () => {
    if (src) {
      openLightbox([{ src, alt: alt || "" }]);
    }
  };

  return (
    <div className="relative w-full">
      <Image
        src={src || ""}
        alt={alt || ""}
        width={800}
        height={450}
        className={merge("w-full h-auto rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity", className)}
        quality={100}
        onClick={handleClick}
        {...props}
      />
    </div>
  );
}
