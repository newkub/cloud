/**
 * Use case: Reverse Engineering
 * Analyzes animations and generates code
 */

import { ReverseEngineering } from "../../../domain/models/ai-tools/reverse-engineering";
import type { ReverseEngineeringOptions } from "../../../types/index";

export function createReverseEngineering(options: ReverseEngineeringOptions) {
	const reverseEngineering = new ReverseEngineering(options);

	return {
		analyze: () => {
			return reverseEngineering.analyze();
		},
		generateCode: (language?: "typescript" | "javascript" | "solidjs") => {
			return reverseEngineering.generateCode(language);
		},
	};
}
