"use client";

import type { StaticImageData } from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { TbClipboard, TbClipboardCheck } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";

const PAGE_LOAD_TIME = Date.now();

type HoverPreviewContent = {
  title: string;
  description: string;
  image?: string | StaticImageData;
};

type PlacementOption = "above" | "below" | "side-left" | "side-right";

type HoverPreviewLinkProps = {
  href: string;
  children: ReactNode;
  preview: HoverPreviewContent;
  className?: string;
  external?: boolean;
  placement?: [PlacementOption] | [PlacementOption, PlacementOption];
  forcePlacement?: boolean;
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
  placement = ["above", "below"],
  forcePlacement = false,
}: HoverPreviewLinkProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const deactivateTimeoutRef = useRef<number | null>(null);

  const [canHover, setCanHover] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [previewPosition, setPreviewPosition] = useState<Point>({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
    // compute preview position once, anchored to the element (not the cursor)
    if (rectRef.current) {
      const anchorX = rectRef.current.left + rectRef.current.width / 2;
      const anchorY = rectRef.current.top + rectRef.current.height / 2;
      computeAndSetPosition(anchorX, anchorY);
    }
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
    // Don't reposition on pointer move; position is computed once on enter and anchored to the element.
    // Still update cached rect for potential layout changes.
    const rect = containerRef.current?.getBoundingClientRect() ?? null;
    if (rect) rectRef.current = rect;
  };

  // Compute preview position based on an anchor point (usually element center) and set it.
  const computeAndSetPosition = (anchorX: number, anchorY: number) => {
    const offset = 30;
    const verticalGap = 100;
    const horizontalGap = 50;
    const margin = 16;
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;

    const fitsInViewport = (x: number, y: number): boolean => {
      return (
        x >= margin &&
        y >= margin &&
        x + PREVIEW_BOUNDS.width <= screenWidth - margin &&
        y + PREVIEW_BOUNDS.height <= screenHeight - margin
      );
    };

    const calculatePosition = (placementType: PlacementOption): Point => {
      switch (placementType) {
        case "above":
          return { x: anchorX - PREVIEW_BOUNDS.width / 2, y: anchorY - PREVIEW_BOUNDS.height - verticalGap };
        case "below":
          return { x: anchorX - PREVIEW_BOUNDS.width / 2, y: anchorY + offset };
        case "side-left":
          return { x: anchorX - PREVIEW_BOUNDS.width - horizontalGap, y: anchorY - PREVIEW_BOUNDS.height / 2 };
        case "side-right":
          return { x: anchorX + horizontalGap, y: anchorY - PREVIEW_BOUNDS.height / 2 };
      }
    };

    // If forcePlacement is set, place using the first preference exactly (no viewport fit check).
    if (forcePlacement) {
      const pos = calculatePosition(placement[0]);
      setPreviewPosition({ x: pos.x, y: pos.y });
      return;
    }

    let bestPosition: Point | null = null;
    for (const placementOption of placement) {
      const pos = calculatePosition(placementOption);
      if (fitsInViewport(pos.x, pos.y)) {
        bestPosition = pos;
        break;
      }
    }

    if (!bestPosition) {
      bestPosition = calculatePosition(placement[0]);
    }

    const nextX = Math.max(margin, Math.min(bestPosition.x, screenWidth - PREVIEW_BOUNDS.width - margin));
    const nextY = Math.max(margin, Math.min(bestPosition.y, screenHeight - PREVIEW_BOUNDS.height - margin));

    setPreviewPosition({ x: nextX, y: nextY });
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
  // Next.js throws when a local image path contains an unconfigured query string.
  // Avoid appending a cache-busting query param for local paths (starting with '/').
  const imageSrc = typeof previewImage === 'string'
    ? (previewImage.startsWith("/")
        ? previewImage
        : `${previewImage}?t=${PAGE_LOAD_TIME}`)
    : previewImage.src;

  const isMailto = href.startsWith("mailto:");
  const mailAddress = isMailto ? href.replace(/^mailto:/, "") : null;

  const handleCopyEmail = (e: React.MouseEvent) => {
    // prevent clicking the preview anchor from navigating
    e.preventDefault();
    e.stopPropagation();

    if (!mailAddress || typeof navigator === "undefined" || !navigator.clipboard) return;

    navigator.clipboard
      .writeText(mailAddress)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      })
      .catch(() => {
        // ignore failures silently
      });
  };
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
            {!isMailto ? (
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                )}
                <Image
                  src={imageSrc}
                  alt={preview.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 240px, 80vw"
                  quality={100}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            ) : null}
            <div className="space-y-1.5 p-4">
              <div className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                {preview.description}
              </div>

              {isMailto && mailAddress ? (
                <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                  <span className="break-all">{mailAddress}</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label={`Copy email ${mailAddress}`}
                    className="inline-flex items-center justify-center p-1 rounded text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <TbClipboardCheck size={14} aria-hidden="true" />
                    ) : (
                      <TbClipboard size={14} aria-hidden="true" />
                    )}
                  </button>
                </div>
              ) : null}
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
            {!isMailto ? (
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                )}
                <Image
                  src={imageSrc}
                  alt={preview.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 240px, 80vw"
                  quality={100}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            ) : null}
            <div className="space-y-1.5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
                  {preview.title}
                </div>
                {isMailto && mailAddress ? (
                  <button
                    onClick={handleCopyEmail}
                    aria-label={`Copy email ${mailAddress}`}
                    className="text-xs px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                ) : null}
              </div>

              <div className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                {preview.description}
              </div>

              {isMailto && mailAddress ? (
                <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">{mailAddress}</div>
              ) : null}
            </div>
          </Link>
        ),
        document.body
      )}
    </>
  );
};

export default HoverPreviewLink;
