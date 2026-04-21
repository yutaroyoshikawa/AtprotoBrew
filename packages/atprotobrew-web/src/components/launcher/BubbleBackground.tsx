import { useEffect, useRef } from "react";

interface Bubble {
	x: number;
	y: number;
	r: number;
	speed: number;
	opacity: number;
	drift: number;
	phase: number;
}

export function BubbleBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animId: number;
		const bubbles: Bubble[] = [];

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();
		window.addEventListener("resize", resize);

		for (let i = 0; i < 28; i++) {
			bubbles.push({
				x: Math.random() * window.innerWidth,
				y: window.innerHeight + Math.random() * 300,
				r: 12 + Math.random() * 44,
				speed: 0.28 + Math.random() * 0.45,
				opacity: 0.08 + Math.random() * 0.14,
				drift: (Math.random() - 0.5) * 0.4,
				phase: Math.random() * Math.PI * 2,
			});
		}

		const draw = (t: number) => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
			grad.addColorStop(0, "hsl(205,72%,82%)");
			grad.addColorStop(0.5, "hsl(200,60%,91%)");
			grad.addColorStop(1, "hsl(195,50%,95%)");
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			for (const b of bubbles) {
				b.y -= b.speed;
				b.x += Math.sin(t * 0.0008 + b.phase) * b.drift;

				if (b.y + b.r < -20) {
					b.y = canvas.height + b.r + Math.random() * 100;
					b.x = Math.random() * canvas.width;
				}

				ctx.save();
				ctx.globalAlpha = b.opacity;

				const bGrad = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.05, b.x, b.y, b.r);
				bGrad.addColorStop(0, "rgba(255,255,255,0.9)");
				bGrad.addColorStop(0.4, "rgba(180,220,255,0.4)");
				bGrad.addColorStop(1, "rgba(100,170,240,0.15)");

				ctx.beginPath();
				ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
				ctx.fillStyle = bGrad;
				ctx.fill();

				ctx.strokeStyle = "rgba(255,255,255,0.55)";
				ctx.lineWidth = 1.2;
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(b.x - b.r * 0.28, b.y - b.r * 0.3, b.r * 0.22, 0, Math.PI * 2);
				ctx.fillStyle = "rgba(255,255,255,0.55)";
				ctx.fill();

				ctx.restore();
			}

			animId = requestAnimationFrame(draw);
		};

		animId = requestAnimationFrame(draw);
		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener("resize", resize);
		};
	}, []);

	// biome-ignore lint/a11y/noAriaHiddenOnFocusable: aaaaa
	return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }} aria-hidden="true" />;
}
