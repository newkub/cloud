/**
 * Render Target port
 * Interface for animation render targets
 */

import type { Result } from "../../../shared/types";

export interface RenderTarget {
	readonly element: Element;
	readonly context: CanvasRenderingContext2D | WebGLRenderingContext | null;
	readonly width: number;
	readonly height: number;
}

export interface IRenderTargetProvider {
	/**
	 * Get render target for element
	 */
	getRenderTarget(element: Element): Promise<Result<RenderTarget>>;

	/**
	 * Release render target
	 */
	releaseRenderTarget(target: RenderTarget): Promise<Result<void>>;

	/**
	 * Check if target type is supported
	 */
	isSupported(element: Element): boolean;
}
