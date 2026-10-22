/**
 * Use case: Shader Effects
 * Handles WebGL shader effects and uniforms
 */

import { ShaderEffects } from "../../../domain/models/graphics/index";
import type { ShaderEffectOptions } from "../../../types/index";

export function createShaderEffects(options: ShaderEffectOptions) {
	const shaderEffects = new ShaderEffects(options);

	return {
		setUniformValue: (name: string, value: number | number[]) => {
			shaderEffects.setUniformValue(name, value);
		},
		render: () => {
			shaderEffects.render();
		},
		animate: () => {
			shaderEffects.animate();
		},
		stopAnimation: () => {
			shaderEffects.stopAnimation();
		},
		dispose: () => {
			shaderEffects.dispose();
		},
	};
}
