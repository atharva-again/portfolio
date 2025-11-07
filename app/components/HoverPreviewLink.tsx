"use client";

import Image from "next/image";
import Link from "next/link";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PAGE_LOAD_TIME = Date.now();

type HoverPreviewContent = {
  title: string;
  description: string;
  image?: string;
};

type HoverPreviewLinkProps = {
  href: string;
  children: ReactNode;
  preview: HoverPreviewContent;
  className?: string;
  external?: boolean;
};

type Point = { x: number; y: number };

const DEFAULT_IMAGE = "/window.svg";
const PREVIEW_BOUNDS = { width: 240, height: 160 };

const cx = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(" ");

export type { HoverPreviewContent };

const HoverPreviewLink = ({
  href,
  children,
  preview,
  className,
  external,
}: HoverPreviewLinkProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const deactivateTimeoutRef = useRef<number | null>(null);

  const [canHover, setCanHover] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [previewPosition, setPreviewPosition] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(hover: hover)");
    const update = () => setCanHover(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    if (deactivateTimeoutRef.current !== null) {
      window.clearTimeout(deactivateTimeoutRef.current);
    }
  }, []);

  const clearDeactivationTimeout = () => {
    if (deactivateTimeoutRef.current !== null) {
      window.clearTimeout(deactivateTimeoutRef.current);
      deactivateTimeoutRef.current = null;
    }
  };

  const scheduleDeactivation = () => {
    if (!canHover) return;
    clearDeactivationTimeout();
    deactivateTimeoutRef.current = window.setTimeout(() => {
      setIsActive(false);
      deactivateTimeoutRef.current = null;
    }, 100);
  };

  const handlePointerEnter = () => {
    if (!canHover) return;
    clearDeactivationTimeout();
    rectRef.current = containerRef.current?.getBoundingClientRect() ?? null;
    setIsActive(true);
  };

  const handlePointerLeave = () => {
    if (!canHover) return;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    scheduleDeactivation();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (!canHover) return;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    const { clientX, clientY } = event;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const rect = rectRef.current ?? containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      rectRef.current = rect;

      if (typeof window === "undefined") {
        return;
      }

      const offset = 24;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      let nextX = clientX + offset;
      let nextY = clientY + offset;

      if (nextX + PREVIEW_BOUNDS.width > screenWidth - 16) {
        nextX = clientX - PREVIEW_BOUNDS.width - offset;
      }

      if (nextY + PREVIEW_BOUNDS.height > screenHeight - 16) {
        nextY = clientY - PREVIEW_BOUNDS.height - offset;
      }

      setPreviewPosition({ x: Math.max(16, nextX), y: Math.max(16, nextY) });
    });
  };

  const handlePreviewEnter = () => {
    if (!canHover) return;
    clearDeactivationTimeout();
    setIsActive(true);
  };

  const handlePreviewLeave = () => {
    if (!canHover) return;
    scheduleDeactivation();
  };

  const isExternal = useMemo(() => {
    if (typeof external === "boolean") return external;
    return /^https?:\/\//.test(href);
  }, [external, href]);

  const anchorClassName = cx(
    "relative z-10 inline-flex items-center align-baseline transition-colors cursor-pointer",
    className,
  );

  const wrapperClassName = cx(
    "relative inline-flex items-center align-baseline",
    isActive ? "cursor-none" : "cursor-pointer",
  );

  const previewImage = preview.image ?? DEFAULT_IMAGE;

  const anchor = isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={anchorClassName}
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={anchorClassName}>
      {children}
    </Link>
  );

  return (
    <>
      <span
        ref={containerRef}
        className={wrapperClassName}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      >
        {anchor}
      </span>

      {isActive && canHover && typeof window !== "undefined" && createPortal(
        isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed z-40 w-[min(240px,80vw)] overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/80 text-left shadow-lg backdrop-blur-md ring-1 ring-black/5 dark:border-zinc-700/60 dark:bg-black/70 dark:ring-white/10"
            style={{
              left: previewPosition.x,
              top: previewPosition.y,
            }}
            onPointerEnter={handlePreviewEnter}
            onPointerLeave={handlePreviewLeave}
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={`${previewImage}?t=${PAGE_LOAD_TIME}`}
                alt={preview.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 240px, 80vw"
              />
            </div>
            <div className="space-y-1.5 p-4">
              <div className="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
                {preview.title}
              </div>
              <div className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                {preview.description}
              </div>
            </div>
          </a>
        ) : (
          <Link
            href={href}
            className="fixed z-40 w-[min(240px,80vw)] overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/80 text-left shadow-lg backdrop-blur-md ring-1 ring-black/5 dark:border-zinc-700/60 dark:bg-black/70 dark:ring-white/10"
            style={{
              left: previewPosition.x,
              top: previewPosition.y,
            }}
            onPointerEnter={handlePreviewEnter}
            onPointerLeave={handlePreviewLeave}
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={`${previewImage}?t=${PAGE_LOAD_TIME}`}
                alt={preview.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 240px, 80vw"
              />
            </div>
            <div className="space-y-1.5 p-4">
              <div className="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
                {preview.title}
              </div>
              <div className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                {preview.description}
              </div>
            </div>
          </Link>
        ),
        document.body
      )}
    </>
  );
};

export default HoverPreviewLink;
