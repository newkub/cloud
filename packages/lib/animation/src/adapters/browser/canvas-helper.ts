import type { CanvasAnimationOptions } from "../../shared/types/canvas";

/**
 * Canvas Helper infrastructure - Handles canvas-based animations (Functional style)
 */

export const clearCanvas = (context: CanvasRenderingContext2D, width: number, height: number): void => {
	context.clearRect(0, 0, width, height);
};

export const drawCanvasRect = (
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	color?: string,
): void => {
	if (color) {
		context.fillStyle = color;
	}
	context.fillRect(x, y, width, height);
};

export const drawCanvasCircle = (
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	radius: number,
	color?: string,
): void => {
	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI * 2);
	if (color) {
		context.fillStyle = color;
	}
	context.fill();
};

export const drawCanvasLine = (
	context: CanvasRenderingContext2D,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	color?: string,
	lineWidth?: number,
): void => {
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	if (color) {
		context.strokeStyle = color;
	}
	if (lineWidth) {
		context.lineWidth = lineWidth;
	}
	context.stroke();
};

export const animateCanvas = (
	context: CanvasRenderingContext2D,
	draw: (context: CanvasRenderingContext2D, progress: number) => void,
	options: CanvasAnimationOptions = {},
): (() => void) => {
	const duration = options.duration || 1000;
	let startTime: number;
	let rafId: number | null = null;

	const animateFrame = (timestamp: number) => {
		if (!startTime) {
			startTime = timestamp;
		}
		const elapsed = timestamp - startTime;
		const progress = Math.min(elapsed / duration, 1);

		draw(context, progress);

		if (progress < 1) {
			rafId = requestAnimationFrame(animateFrame);
		}
	};

	rafId = requestAnimationFrame(animateFrame);

	return () => {
		if (rafId) {
			cancelAnimationFrame(rafId);
		}
	};
};
