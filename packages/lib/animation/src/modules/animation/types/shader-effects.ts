/**
 * Shader Effects types
 */

export interface ShaderEffectOptions {
	canvas: HTMLCanvasElement;
	vertexShader?: string;
	fragmentShader?: string;
	uniforms?: Record<string, number | number[]>;
}

export interface ShaderUniform {
	name: string;
	value: number | number[];
	type: "float" | "vec2" | "vec3" | "vec4";
}
