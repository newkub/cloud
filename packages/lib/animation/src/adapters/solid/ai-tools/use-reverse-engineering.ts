/**
 * SolidJS composable for Reverse Engineering
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createReverseEngineering } from "../../../modules/animation/application/usecases/ai-tools";
import type { AnimationCode, ReverseEngineeringOptions } from "../../../modules/animation/types";

export function useReverseEngineering(options: ReverseEngineeringOptions) {
	const [reverseEngineering, setReverseEngineering] = createSignal<ReturnType<typeof createReverseEngineering> | null>(
		null,
	);
	const [styles, setStyles] = createSignal<Record<string, unknown>>({});
	const [code, setCode] = createSignal<AnimationCode | null>(null);

	const createReverseInstance = () => {
		const re = createReverseEngineering(options);
		setReverseEngineering(re);
		setStyles(re.analyze());
		return re;
	};

	const analyze = () => {
		const re = reverseEngineering() || createReverseInstance();
		const analyzedStyles = re.analyze();
		setStyles(analyzedStyles);
		return analyzedStyles;
	};

	const generateCode = (language?: "typescript" | "javascript" | "solidjs") => {
		const re = reverseEngineering();
		if (re) {
			const generatedCode = re.generateCode(language);
			setCode(generatedCode);
			return generatedCode;
		}
		return null;
	};

	// Auto-analyze on mount
	createEffect(() => {
		createReverseInstance();
		onCleanup(() => {
			// No cleanup needed for reverse engineering
		});
	});

	return {
		analyze,
		generateCode,
		styles,
		code,
		reverseEngineering,
	};
}
