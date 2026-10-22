/**
 * Use case: AI Animation Generator
 * Generates animations from text prompts
 */

import { AIAnimationGenerator } from "../../../domain/models/ai-tools/ai-animation-generator";
import type { AIAnimationOptions, GeneratedAnimation } from "../../../types/index";

export function createAIAnimationGenerator(options: AIAnimationOptions) {
	const generator = new AIAnimationGenerator(options);

	return {
		generate: (): GeneratedAnimation => {
			return generator.generate();
		},
	};
}
