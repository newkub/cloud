/**
 * SolidJS composable for WebGL Renderer
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createWebGLRenderer } from "../../../modules/animation/application/usecases/graphics";
import type { WebGLRendererOptions, WebGLShader } from "../../../modules/animation/types";

export function useWebGLRenderer(options: WebGLRendererOptions = {}) {
	const [renderer, setRenderer] = createSignal<ReturnType<typeof createWebGLRenderer> | null>(null);
	const [isInitialized, setIsInitialized] = createSignal(false);
	const [canvas, setCanvas] = createSignal<HTMLCanvasElement | null>(null);

	const createRendererInstance = () => {
		const r = createWebGLRenderer(options);
		const initialized = r.initialize();
		setRenderer(r);
		setIsInitialized(initialized);
		setCanvas(r.getCanvas());
		return r;
	};

	const clear = (red?: number, green?: number, blue?: number, alpha?: number) => {
		const r = renderer();
		if (r) {
			r.clear(red, green, blue, alpha);
		}
	};

	const createShader = (shader: WebGLShader) => {
		const r = renderer();
		if (r) {
			return r.createShader(shader);
		}
		return null;
	};

	const useProgram = (program: WebGLProgram) => {
		const r = renderer();
		if (r) {
			r.useProgram(program);
		}
	};

	const resize = (width: number, height: number) => {
		const r = renderer();
		if (r) {
			r.resize(width, height);
		}
	};

	// Auto-create instance on mount
	createEffect(() => {
		const instance = createRendererInstance();
		onCleanup(() => {
			instance?.dispose();
		});
	});

	return {
		initialize: () => {
			const r = renderer() || createRendererInstance();
			return r.initialize();
		},
		clear,
		createShader,
		useProgram,
		resize,
		isInitialized,
		canvas,
		renderer,
	};
}
