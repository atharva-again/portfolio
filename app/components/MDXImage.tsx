"use client";

import Image from "next/image";
import { useState } from "react";

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

  return (
    <div className="relative w-full h-64 md:h-96 my-6">
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
      )}
      <Image
        src={src || ""}
        alt={alt || ""}
        fill
        className={merge("object-cover rounded-lg shadow-md", className)}
        quality={100}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}
