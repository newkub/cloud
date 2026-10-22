import { animate, clear, drawCircle, drawLine, drawRect } from "../../../../../adapters/browser/index";
import type { CanvasAnimationOptions } from "../../../../../shared/types/index";

/**
 * Use case: Canvas-based animations
 */
export function createCanvasFactory() {
	return {
		clear(context: CanvasRenderingContext2D, width: number, height: number): void {
			clear(context, width, height);
		},

		drawRect(
			context: CanvasRenderingContext2D,
			x: number,
			y: number,
			width: number,
			height: number,
			color?: string,
		): void {
			drawRect(context, x, y, width, height, color);
		},

		drawCircle(context: CanvasRenderingContext2D, x: number, y: number, radius: number, color?: string): void {
			drawCircle(context, x, y, radius, color);
		},

		drawLine(
			context: CanvasRenderingContext2D,
			x1: number,
			y1: number,
			x2: number,
			y2: number,
			color?: string,
			lineWidth?: number,
		): void {
			drawLine(context, x1, y1, x2, y2, color, lineWidth);
		},

		animate(
			context: CanvasRenderingContext2D,
			draw: (context: CanvasRenderingContext2D, progress: number) => void,
			_options: CanvasAnimationOptions = {},
		): () => void {
			return animate(context, draw, _options);
		},
	};
}
