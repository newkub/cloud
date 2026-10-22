/**
 * Use case: WebGL Renderer
 * Creates and manages WebGL rendering context
 */

import { WebGLRenderer } from "../../../domain/models/graphics/index";
import type { WebGLRendererOptions, WebGLShader } from "../../../types/index";

export function createWebGLRenderer(options: WebGLRendererOptions = {}) {
	const renderer = new WebGLRenderer(options);

	return {
		initialize: () => {
			return renderer.initialize();
		},
		getCanvas: () => {
			return renderer.getCanvas();
		},
		getContext: () => {
			return renderer.getContext();
		},
		clear: (r?: number, g?: number, b?: number, a?: number) => {
			renderer.clear(r, g, b, a);
		},
		createShader: (shader: WebGLShader) => {
			return renderer.createShader(shader);
		},
		useProgram: (program: WebGLProgram) => {
			renderer.useProgram(program);
		},
		resize: (width: number, height: number) => {
			renderer.resize(width, height);
		},
		dispose: () => {
			renderer.dispose();
		},
	};
}
