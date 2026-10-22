/**
 * Shader Effects Domain Model
 * Handles WebGL shader effects and uniforms
 */

import type { ShaderEffectOptions } from "../../../types";

export class ShaderEffects {
	private options: ShaderEffectOptions;
	private gl: WebGLRenderingContext | null = null;
	private program: WebGLProgram | null = null;
	private uniforms: Map<string, WebGLUniformLocation> = new Map();
	private animationFrameId: number | null = null;
	private startTime = 0;

	constructor(options: ShaderEffectOptions) {
		this.options = options;
		this.initialize();
	}

	private initialize(): void {
		const canvas = this.options.canvas;
		this.gl = canvas.getContext("webgl") ?? (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

		if (!this.gl) {
			console.error("WebGL not supported");
			return;
		}

		this.createProgram();
	}

	private createProgram(): void {
		if (!this.gl) return;

		const vertexShaderSource = this.options.vertexShader ?? this.getDefaultVertexShader();
		const fragmentShaderSource = this.options.fragmentShader ?? this.getDefaultFragmentShader();

		const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

		if (!vertexShader || !fragmentShader) return;

		this.program = this.gl.createProgram();
		if (!this.program) return;

		this.gl.attachShader(this.program, vertexShader);
		this.gl.attachShader(this.program, fragmentShader);
		this.gl.linkProgram(this.program);

		if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
			console.error("Shader program link error:", this.gl.getProgramInfoLog(this.program));
			return;
		}

		this.gl.useProgram(this.program);
		this.setupUniforms();
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

	private setupUniforms(): void {
		if (!this.gl || !this.program) return;

		if (this.options.uniforms) {
			for (const [name, value] of Object.entries(this.options.uniforms)) {
				const location = this.gl.getUniformLocation(this.program, name);
				if (location) {
					this.uniforms.set(name, location);
					this.setUniform(name, value);
				}
			}
		}
	}

	private setUniform(name: string, value: number | number[]): void {
		if (!this.gl) return;

		const location = this.uniforms.get(name);
		if (!location) return;

		if (typeof value === "number") {
			this.gl.uniform1f(location, value);
		} else if (value.length === 2 && value[0] !== undefined && value[1] !== undefined) {
			this.gl.uniform2f(location, value[0], value[1]);
		} else if (value.length === 3 && value[0] !== undefined && value[1] !== undefined && value[2] !== undefined) {
			this.gl.uniform3f(location, value[0], value[1], value[2]);
		} else if (
			value.length === 4 &&
			value[0] !== undefined &&
			value[1] !== undefined &&
			value[2] !== undefined &&
			value[3] !== undefined
		) {
			this.gl.uniform4f(location, value[0], value[1], value[2], value[3]);
		}
	}

	public setUniformValue(name: string, value: number | number[]): void {
		this.setUniform(name, value);
	}

	public render(): void {
		if (!this.gl || !this.program) return;

		this.gl.useProgram(this.program);
		this.gl.viewport(0, 0, this.options.canvas.width, this.options.canvas.height);
		this.gl.clearColor(0, 0, 0, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		// Draw a full-screen quad
		const positionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), this.gl.STATIC_DRAW);

		const positionLocation = this.gl.getAttribLocation(this.program, "a_position");
		if (positionLocation) {
			this.gl.enableVertexAttribArray(positionLocation);
			this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
		}

		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
	}

	public animate(): void {
		this.startTime = performance.now();
		const animateFrame = () => {
			const elapsed = (performance.now() - this.startTime) / 1000;

			// Update time uniform
			this.setUniformValue("u_time", elapsed);

			this.render();
			this.animationFrameId = requestAnimationFrame(animateFrame);
		};

		this.animationFrameId = requestAnimationFrame(animateFrame);
	}

	public stopAnimation(): void {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	private getDefaultVertexShader(): string {
		return `
			attribute vec2 a_position;
			void main() {
				gl_Position = vec4(a_position, 0.0, 1.0);
			}
		`;
	}

	private getDefaultFragmentShader(): string {
		return `
			precision mediump float;
			uniform float u_time;
			uniform vec2 u_resolution;

			void main() {
				vec2 uv = gl_FragCoord.xy / u_resolution;
				vec3 color = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0, 2, 4));
				gl_FragColor = vec4(color, 1.0);
			}
		`;
	}

	public dispose(): void {
		this.stopAnimation();
		if (this.gl && this.program) {
			this.gl.deleteProgram(this.program);
		}
		this.uniforms.clear();
	}
}
