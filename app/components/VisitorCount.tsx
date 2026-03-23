"use client";

import { useEffect, useRef, useState } from "react";

export default function VisitorCount() {
	const [count, setCount] = useState<number | null>(null);
	const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
	const [isBlinking, setIsBlinking] = useState(false);
	const eyeRef = useRef<HTMLDivElement>(null);
	const code = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;

	useEffect(() => {
		if (!code) return;

		fetch("/api/stats/total?no_branding=true")
			.then((r) => r.json())
			.then((d) => setCount(d.count))
			.catch(() => {});
	}, [code]);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!eyeRef.current) return;

			const rect = eyeRef.current.getBoundingClientRect();
			const eyeCenterX = rect.left + rect.width / 2;
			const eyeCenterY = rect.top + rect.height / 2;

			const dx = e.clientX - eyeCenterX;
			const dy = e.clientY - eyeCenterY;
			const angle = Math.atan2(dy, dx);
			const distance = Math.min(Math.hypot(dx, dy), 100);
			const maxOffset = 2.5;
			const offset = (distance / 100) * maxOffset;

			setPupilOffset({
				x: Math.cos(angle) * offset,
				y: Math.sin(angle) * offset,
			});
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	useEffect(() => {
		const blink = () => {
			setIsBlinking(true);
			setTimeout(() => setIsBlinking(false), 150);
		};

		const scheduleBlink = () => {
			const delay = 2000 + Math.random() * 4000;
			return setTimeout(() => {
				blink();
				timerId = scheduleBlink();
			}, delay);
		};

		let timerId = scheduleBlink();
		return () => clearTimeout(timerId);
	}, []);

	if (!code || count === null) return null;

	return (
		<div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
			<div ref={eyeRef} className="relative h-6 w-6 group cursor-default">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="h-6 w-6 opacity-50 group-hover:opacity-70 transition-opacity"
					aria-hidden="true"
				>
					<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />

					{!isBlinking ? (
						<>
							<circle
								cx={12 + pupilOffset.x}
								cy={12 + pupilOffset.y}
								r="3"
								fill="currentColor"
								stroke="none"
							/>
							<circle
								cx={15 + pupilOffset.x * 0.3}
								cy={9 + pupilOffset.y * 0.3}
								r="0.8"
								fill="currentColor"
								stroke="none"
								className="opacity-40"
							/>
						</>
					) : (
						<line x1="9" y1="12" x2="15" y2="12" strokeWidth="1.5" />
					)}
				</svg>
			</div>
			<span className="tabular-nums">
				{count.toLocaleString()} {count === 1 ? "visitor" : "visitors"}
			</span>
		</div>
	);
}
