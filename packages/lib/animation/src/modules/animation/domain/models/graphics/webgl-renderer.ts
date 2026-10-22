/**
 * WebGL Renderer Domain Model
 * Handles WebGL context and basic rendering
 */

import type { WebGLRendererOptions, WebGLShader } from "../../../types";

export class WebGLRenderer {
	private canvas: HTMLCanvasElement;
	private gl: WebGLRenderingContext | null = null;
	private options: WebGLRendererOptions;
	private isInitialized = false;

	constructor(options: WebGLRendererOptions = {}) {
		this.options = {
			width: 800,
			height: 600,
			antialias: true,
			alpha: true,
			...options,
		};

		this.canvas = options.canvas ?? document.createElement("canvas");
		this.canvas.width = this.options.width ?? 800;
		this.canvas.height = this.options.height ?? 600;
	}

	public initialize(): boolean {
		const contextAttributes = {
			alpha: this.options.alpha ?? true,
			antialias: this.options.antialias ?? true,
		};

		this.gl = (this.canvas.getContext("webgl", contextAttributes) ??
			this.canvas.getContext("experimental-webgl", contextAttributes)) as WebGLRenderingContext | null;

		if (!this.gl) {
			console.error("WebGL not supported");
			return false;
		}

		this.isInitialized = true;
		return true;
	}

	public getCanvas(): HTMLCanvasElement {
		return this.canvas;
	}

	public getContext(): WebGLRenderingContext | null {
		return this.isInitialized ? this.gl : null;
	}

	public getIsInitialized(): boolean {
		return this.isInitialized;
	}

	public clear(r: number = 0, g: number = 0, b: number = 0, a: number = 1): void {
		if (!this.gl) return;
		this.gl.clearColor(r, g, b, a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	public createShader(shader: WebGLShader): WebGLProgram | null {
		if (!this.gl) return null;

		const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, shader.vertexSource);
		const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, shader.fragmentSource);

		if (!vertexShader || !fragmentShader) {
			return null;
		}

		const program = this.gl.createProgram();
		if (!program) return null;

		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.linkProgram(program);

		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
			console.error("Shader program link error:", this.gl.getProgramInfoLog(program));
			this.gl.deleteProgram(program);
			return null;
		}

		return program;
	}

	private compileShader(type: number, source: string): WebGLShader | null {
		if (!this.gl) return null;

		const shader = this.gl.createShader(type);
		if (!shader) return null;

		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.error("Shader compile error:", this.gl.getShaderInfoLog(shader));
			this.gl.deleteShader(shader);
			return null;
		}

		return shader as WebGLShader;
	}

	public useProgram(program: WebGLProgram): void {
		if (!this.gl) return;
		this.gl.useProgram(program);
	}

	public resize(width: number, height: number): void {
		this.canvas.width = width;
		this.canvas.height = height;
		if (this.gl) {
			this.gl.viewport(0, 0, width, height);
		}
	}

	public dispose(): void {
		if (this.gl) {
			// Clean up WebGL resources
			const numTextures = this.gl.getParameter(this.gl.MAX_TEXTURE_IMAGE_UNITS);
			for (let i = 0; i < numTextures; i++) {
				this.gl.activeTexture(this.gl.TEXTURE0 + i);
				this.gl.bindTexture(this.gl.TEXTURE_2D, null);
			}

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
			this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
		}
		this.isInitialized = false;
	}
}
