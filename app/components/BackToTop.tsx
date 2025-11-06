"use client";

import { useEffect, useRef, useState } from "react";

/**
 * BackToTop button with circular progress stroke that fills as the user scrolls.
 *
 * Usage: include <BackToTop /> anywhere (layout is fine). This is a client component.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0); // 0 .. 1
  const lastKnownScrollY = useRef(0);
  const ticking = useRef(false);

  // SVG circle params
  const size = 52;
  const stroke = 3.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    function updateProgress() {
      const scrollY = window.scrollY || window.pageYOffset;
      const doc = document.documentElement;
      const totalScroll = Math.max(
        1,
        (doc.scrollHeight || document.body.scrollHeight) - window.innerHeight,
      );
      const p = Math.max(0, Math.min(1, scrollY / totalScroll));
      setProgress(p);
      setVisible(scrollY > 200); // show when scrolled more than 200px
      ticking.current = false;
    }

    function onScroll() {
      lastKnownScrollY.current = window.scrollY || window.pageYOffset;
      if (!ticking.current) {
        window.requestAnimationFrame(updateProgress);
        ticking.current = true;
      }
    }

    // initialize
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // stroke offset based on progress
  const strokeDashoffset = `${(1 - progress) * circumference}`;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed right-6 bottom-6 z-50 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label="Back to top"
        title="Back to top"
        className="relative flex h-13 w-13 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm hover:bg-white dark:bg-black/90 dark:hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-700 cursor-pointer"
        style={{
          // ensure the button is a consistent size
          height: size,
          width: size,
          padding: 6,
        }}
      >
        {/* Circular progress background */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute -z-10"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="btp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* faint track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(15,23,42,0.06)"
            strokeWidth={stroke}
            fill="none"
          />

          {/* progress stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#btp-grad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 200ms linear, opacity 200ms",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />
        </svg>

        {/* arrow icon */}
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="relative z-10"
        >
          <path
            d="M12 5v14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 12l-7-7-7 7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
