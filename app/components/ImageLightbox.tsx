"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxProps {
  images: Array<{
    src: string | StaticImageData;
    alt: string;
  }>;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: ImageLightboxProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'in' | 'out' | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchCurrentY, setTouchCurrentY] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  // Visual feedback when navigation is triggered via button/strip/keyboard
  const [pressedSide, setPressedSide] = useState<'left' | 'right' | null>(null);
  const pressedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAnimationDirection('in');
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      setAnimationDirection('out');
      setIsAnimating(true);
      document.body.style.overflow = 'unset';
    }

    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (!isOpen) {
        setAnimationDirection(null);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          // brief pressed visual
          window.clearTimeout(pressedTimerRef.current ?? undefined);
          setPressedSide('left');
          pressedTimerRef.current = window.setTimeout(() => setPressedSide(null), 140);
          onPrev?.();
          break;
        case 'ArrowRight':
          window.clearTimeout(pressedTimerRef.current ?? undefined);
          setPressedSide('right');
          pressedTimerRef.current = window.setTimeout(() => setPressedSide(null), 140);
          onNext?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  // Clear any pending pressed timers on unmount
  useEffect(() => {
    return () => {
      if (pressedTimerRef.current) {
        window.clearTimeout(pressedTimerRef.current);
        pressedTimerRef.current = null;
      }
    };
  }, []);

  // Touch handlers for swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setTouchCurrentY(e.touches[0].clientY);
    setTouchStartX(e.touches[0].clientX);
    setTouchCurrentX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY || touchStartX === null) return;
    setTouchCurrentY(e.touches[0].clientY);
    setTouchCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    // If we don't have starting coords, just reset
    if (touchStartY === null || touchStartX === null || touchCurrentY === null || touchCurrentX === null) {
      setIsSwiping(false);
      setTouchStartY(null);
      setTouchCurrentY(null);
      setTouchStartX(null);
      setTouchCurrentX(null);
      return;
    }

    const deltaX = touchCurrentX - touchStartX;
    const deltaY = touchCurrentY - touchStartY;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    const horizontalThreshold = 50; // px to consider a horizontal swipe
    const verticalThreshold = 100; // px to consider a vertical swipe (close)

    // If horizontal-dominant and exceeds threshold, navigate
    if (absX > absY * 1.2 && absX > horizontalThreshold) {
      // swipe left (negative deltaX) -> next
      if (deltaX < 0) {
        // visual feedback
        window.clearTimeout(pressedTimerRef.current ?? undefined);
        setPressedSide('right');
        pressedTimerRef.current = window.setTimeout(() => setPressedSide(null), 140);
        onNext?.();
      } else {
        window.clearTimeout(pressedTimerRef.current ?? undefined);
        setPressedSide('left');
        pressedTimerRef.current = window.setTimeout(() => setPressedSide(null), 140);
        onPrev?.();
      }
    } else if (deltaY > verticalThreshold && absY > absX * 1.2) {
      // swipe down (vertical-dominant) -> close
      onClose();
    }

    // reset touch state
    setTouchStartY(null);
    setTouchCurrentY(null);
    setTouchStartX(null);
    setTouchCurrentX(null);
    setIsSwiping(false);
  };

  // Wheel handler for desktop two-finger horizontal scroll navigation
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const lastWheelDirRef = useRef<number | null>(null);
  const lastWheelTimeRef = useRef<number>(0);

  // Attach a native, non-passive wheel listener when the lightbox is open.
  // This allows calling preventDefault() to stop browser forward/back gestures
  // on desktop trackpads for horizontal two-finger swipes.
  useEffect(() => {
    if (!isOpen) return;
    const node = overlayRef.current ?? document;

    const handler = (e: Event) => {
      const we = e as WheelEvent;
      const now = Date.now();
      const wheelDebounce = 250; // ms
      const threshold = 20; // px - higher threshold to avoid accidental triggers
      const deltaX = we.deltaX;
      const deltaY = we.deltaY;

      // Only consider horizontal-dominant gestures with sufficient magnitude
      if (Math.abs(deltaX) <= Math.abs(deltaY) * 1.5) return;
      if (Math.abs(deltaX) < threshold) return;

      // Debounce repeated events in the same direction
  const dir = deltaX > 0 ? 1 : -1;
  if (lastWheelDirRef.current === dir && now - lastWheelTimeRef.current < wheelDebounce) return;
  lastWheelDirRef.current = dir;
  lastWheelTimeRef.current = now;

      // Prevent browser navigation (forward/back) while handling the gesture
      e.preventDefault();

      if (dir > 0) {
        onNext?.();
      } else {
        onPrev?.();
      }
    };

    node.addEventListener("wheel", handler as EventListener, { passive: false });
    return () => node.removeEventListener("wheel", handler as EventListener);
  }, [isOpen, onNext, onPrev]);

  if (!isOpen && !isAnimating) return null;

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  // Safety check - don't render if no valid image
  if (!currentImage || !images.length) {
    return null;
  }

  // Calculate swipe progress for visual feedback
  const getSwipeProgress = () => {
    if (!touchStartY || !touchCurrentY || !isSwiping) return 0;
    const swipeDistance = touchCurrentY - touchStartY;
    return Math.max(0, Math.min(1, swipeDistance / 150)); // Max at 150px
  };

  const swipeProgress = getSwipeProgress();

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
        animationDirection === 'in' ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
      ref={overlayRef}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-sm"
        aria-label="Close lightbox"
      >
        <X size={28} />
      </button>

      {/* Desktop chevrons (hidden on small screens) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev?.();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-white bg-black/60 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-lg backdrop-blur-sm"
        disabled={!hasMultiple}
        aria-label="Previous image"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext?.();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-white bg-black/60 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-lg backdrop-blur-sm"
        disabled={!hasMultiple}
        aria-label="Next image"
      >
        <ChevronRight size={28} />
      </button>

  {/* Clickable full-height edge areas to navigate (narrow vertical strips) - desktop only */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev?.();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        aria-label="Previous image area"
        className="hidden sm:block absolute inset-y-0 left-0 z-0 w-16 cursor-pointer bg-transparent"
        tabIndex={-1}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext?.();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        aria-label="Next image area"
        className="hidden sm:block absolute inset-y-0 right-0 z-0 w-16 cursor-pointer bg-transparent"
        tabIndex={-1}
      />

      {/* Desktop image counter - absolute at bottom center (restore original placement) */}
      {hasMultiple && (
        <div className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Image + mobile nav wrapper: stack vertically so mobile buttons appear below the image */}
      <div className="flex flex-col items-center">
        {/* Mobile top touch spacer: increases swipeable area above the image (mobile only) */}
        <div
          className="sm:hidden w-full h-20"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        {/* Image container */}
        <div
          className={`relative max-w-[90vw] max-h-[85vh] transition-transform duration-300 ${
            animationDirection === 'in' ? 'scale-100' : 'scale-95'
          }`}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: isSwiping
              ? `translateY(${swipeProgress * 50}px) scale(${1 - swipeProgress * 0.1})`
              : animationDirection === 'in' ? 'scale(1)' : 'scale(0.95)',
            opacity: isSwiping ? 1 - swipeProgress * 0.3 : 1,
          }}
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            width={1200}
            height={800}
            className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl"
            quality={100}
            priority
          />
        </div>

        {/* Mobile bottom touch spacer: increases swipeable area below the image (mobile only) */}
        <div
          className="sm:hidden w-full h-20"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Image counter (mobile) */}
        {hasMultiple && (
          <div className="sm:hidden mt-3 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

  {/* Mobile navigation buttons: fixed position near the bottom on small screens */}
  <div className="absolute left-1/2 -translate-x-1/2 bottom-12 flex gap-4 justify-center sm:hidden z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.clearTimeout(pressedTimerRef.current ?? undefined);
              setPressedSide('left');
              pressedTimerRef.current = window.setTimeout(() => setPressedSide(null), 140);
              onPrev?.();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setPressedSide('left');
            }}
            onMouseUp={() => {
              window.clearTimeout(pressedTimerRef.current ?? undefined);
              pressedTimerRef.current = window.setTimeout(() => setPressedSide(null), 140);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              setPressedSide('left');
            }}
            onTouchEnd={() => {
              window.clearTimeout(pressedTimerRef.current ?? undefined);
              pressedTimerRef.current = window.setTimeout(() => setPressedSide(null), 140);
            }}
            className={`px-4 py-2 rounded-full text-white transition-all duration-150 shadow-lg backdrop-blur-sm ${
              pressedSide === 'left' ? 'scale-95 bg-black/80' : 'bg-black/60 hover:bg-black/80'
            }`}
            aria-label="Previous image"
            disabled={!hasMultiple}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              window.clearTimeout(pressedTimerRef.current ?? undefined);
              setPressedSide('right');
              pressedTimerRef.current = window.setTimeout(() => setPressedSide(null), 140);
              onNext?.();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setPressedSide('right');
            }}
            onMouseUp={() => {
              window.clearTimeout(pressedTimerRef.current ?? undefined);
              pressedTimerRef.current = window.setTimeout(() => setPressedSide(null), 140);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              setPressedSide('right');
            }}
            onTouchEnd={() => {
              window.clearTimeout(pressedTimerRef.current ?? undefined);
              pressedTimerRef.current = window.setTimeout(() => setPressedSide(null), 140);
            }}
            className={`px-4 py-2 rounded-full text-white transition-all duration-150 shadow-lg backdrop-blur-sm ${
              pressedSide === 'right' ? 'scale-95 bg-black/80' : 'bg-black/60 hover:bg-black/80'
            }`}
            aria-label="Next image"
            disabled={!hasMultiple}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}