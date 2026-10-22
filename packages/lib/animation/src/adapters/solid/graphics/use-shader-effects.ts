/**
 * SolidJS composable for Shader Effects
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createShaderEffects } from "../../../modules/animation/application/usecases/graphics";
import type { ShaderEffectOptions } from "../../../modules/animation/types";

export function useShaderEffects(options: ShaderEffectOptions) {
	const [shaderEffects, setShaderEffects] = createSignal<ReturnType<typeof createShaderEffects> | null>(null);
	const [isAnimating, setIsAnimating] = createSignal(false);

	const createEffectsInstance = () => {
		const se = createShaderEffects(options);
		setShaderEffects(se);
		return se;
	};

	const setUniformValue = (name: string, value: number | number[]) => {
		const se = shaderEffects();
		if (se) {
			se.setUniformValue(name, value);
		}
	};

	const render = () => {
		const se = shaderEffects();
		if (se) {
			se.render();
		}
	};

	const animate = () => {
		const se = shaderEffects();
		if (se) {
			se.animate();
			setIsAnimating(true);
		}
	};

	const stopAnimation = () => {
		const se = shaderEffects();
		if (se) {
			se.stopAnimation();
			setIsAnimating(false);
		}
	};

	// Auto-create instance on mount
	createEffect(() => {
		const instance = createEffectsInstance();
		onCleanup(() => {
			instance?.dispose();
		});
	});

	return {
		setUniformValue,
		render,
		animate,
		stopAnimation,
		isAnimating,
		shaderEffects,
	};
}
