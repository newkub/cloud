import { splitText, wrapElement } from "../../../../../adapters/browser/index";
import type { SplitTextResult, TextSplitOptions } from "../../../../../shared/types/index";

/**
 * Use case: Split text into characters, words, or lines
 */
export function createTextSplitFactory() {
	return function splitTextWrapper(element: HTMLElement, options: TextSplitOptions): SplitTextResult {
		return splitText(element.textContent || "", options);
	};
}

export function createTextWrapper() {
	return function wrapText(element: HTMLElement, type: "chars" | "words" | "lines"): void {
		wrapElement(element, type);
	};
}
