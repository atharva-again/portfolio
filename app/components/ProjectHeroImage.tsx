"use client";

import Image from "next/image";
import { useState } from "react";
import type { StaticImageData } from "next/image";

interface ProjectHeroImageProps {
  src: string | StaticImageData;
  alt: string;
}

export default function ProjectHeroImage({ src, alt }: ProjectHeroImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="mb-12 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" style={{ height: '500px' }} />
      )}
      <Image
        src={src}
        alt={alt}
        width={800}
        height={500}
        className="w-full h-auto rounded-lg object-cover"
        priority
        quality={100}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
