/**
 * WebGL Renderer Types
 */

export interface WebGLRendererOptions {
	canvas?: HTMLCanvasElement;
	width?: number;
	height?: number;
	antialias?: boolean;
	alpha?: boolean;
}

export interface WebGLShader {
	vertexSource: string;
	fragmentSource: string;
}
