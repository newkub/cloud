/**
 * SolidJS composable for AI Animation Generator
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createAIAnimationGenerator } from "../../../modules/animation/application/usecases/ai-tools";
import type { AIAnimationOptions, GeneratedAnimation } from "../../../modules/animation/types";

export function useAIAnimationGenerator(options: AIAnimationOptions) {
	const [generator, setGenerator] = createSignal<ReturnType<typeof createAIAnimationGenerator> | null>(null);
	const [animation, setAnimation] = createSignal<GeneratedAnimation | null>(null);
	const [isGenerating, setIsGenerating] = createSignal(false);

	const createGeneratorInstance = () => {
		const g = createAIAnimationGenerator(options);
		setGenerator(g);
		return g;
	};

	const generate = () => {
		const g = generator() || createGeneratorInstance();
		setIsGenerating(true);
		const generated = g.generate();
		setAnimation(generated);
		setIsGenerating(false);
		return generated;
	};

	// Auto-create instance on mount
	createEffect(() => {
		createGeneratorInstance();
		onCleanup(() => {
			// No cleanup needed for generator
		});
	});

	return {
		generate,
		animation,
		isGenerating,
		generator,
	};
}
