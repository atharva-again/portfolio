"use client";

import { createContext, useContext, useState, ReactNode, useRef, useCallback, useEffect } from "react";
import ImageLightbox from "./ImageLightbox";
import type { StaticImageData } from "next/image";

interface LightboxImage {
  src: string | StaticImageData;
  alt: string;
}

interface LightboxContextType {
  openLightbox: (images: LightboxImage[], startIndex?: number) => void;
  closeLightbox: () => void;
  registerImage: (image: LightboxImage) => number;
  unregisterImage: (id: number) => void;
  openLightboxAtId: (id: number) => void;
}

const LightboxContext = createContext<LightboxContextType | null>(null);

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return context;
}

interface LightboxProviderProps {
  children: ReactNode;
}

export function LightboxProvider({ children }: LightboxProviderProps) {
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [registry, setRegistry] = useState<Array<{ id: number; image: LightboxImage }>>([]);
  const registryRef = useRef<Array<{ id: number; image: LightboxImage }>>([]);
  const nextIdRef = useRef(0);

  const openLightbox = (newImages: LightboxImage[], startIndex = 0) => {
    setImages(newImages);
    setCurrentIndex(startIndex);
    setIsOpen(true);
  };

  // Register an image into the page-level registry. Returns its id (index).
  const registerImage = useCallback((image: LightboxImage) => {
    const id = nextIdRef.current++;
    const entry = { id, image };
    registryRef.current.push(entry);
    // update state for consumers if needed
    setRegistry([...registryRef.current]);
    return id;
  }, []);

  const unregisterImage = useCallback((id: number) => {
    registryRef.current = registryRef.current.filter((e) => e.id !== id);
    setRegistry([...registryRef.current]);
  }, []);

  const openLightboxAtId = useCallback((id: number) => {
    if (registryRef.current.length === 0) return;
    // Find the index of the entry with the given unique id
    const idx = registryRef.current.findIndex((e) => e.id === id);
    const startIndex = idx === -1 ? 0 : idx;
    setImages(registryRef.current.map((e) => e.image));
    setCurrentIndex(startIndex);
    setIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle browser back navigation when lightbox is open
  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = () => {
      // Close the lightbox when user tries to go back
      closeLightbox();
      // Push the state back to prevent actual navigation
      window.history.pushState(null, '', window.location.href);
    };

    // Push a state to enable back navigation to close lightbox
    window.history.pushState({ lightbox: true }, '', window.location.href);
    
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen]);

  return (
    <LightboxContext.Provider
      value={{ openLightbox, closeLightbox, registerImage, unregisterImage, openLightboxAtId }}
    >
      {children}
      <ImageLightbox
        images={images}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={closeLightbox}
        onNext={goToNext}
        onPrev={goToPrev}
      />
    </LightboxContext.Provider>
  );
}