import type { SplitTextResult, TextSplitOptions } from "../../shared/types/text";

/**
 * Text Splitter infrastructure - Splits text into characters, words, and lines (Functional style)
 */

const splitChars = (text: string): SplitTextResult => {
	const chars = text.split("");
	return {
		chars,
		words: chars.join(" ").split(" "),
		lines: [text],
	};
};

const splitWords = (text: string, preserveSpaces = false): SplitTextResult => {
	const words = preserveSpaces ? text.split(/(\s+)/) : text.split(/\s+/).filter((w) => w);
	return {
		chars: text.split(""),
		words,
		lines: text.split("\n"),
	};
};

const splitLines = (text: string, trim = false): SplitTextResult => {
	const lines = text.split("\n").map((line) => (trim ? line.trim() : line));
	return {
		chars: text.split(""),
		words: text.split(/\s+/),
		lines,
	};
};

export const splitText = (text: string, options: TextSplitOptions): SplitTextResult => {
	switch (options.type) {
		case "chars":
			return splitChars(text);
		case "words":
			return splitWords(text, options.preserveSpaces);
		case "lines":
			return splitLines(text, options.trim);
		default:
			return { chars: [], words: [], lines: [] };
	}
};

const wrapTextParts = (element: HTMLElement, parts: string[], displayStyle: string, separator?: string): void => {
	element.textContent = "";

	parts.forEach((part) => {
		const span = document.createElement("span");
		span.textContent = part;
		span.style.display = displayStyle;
		element.appendChild(span);
		if (separator) {
			element.appendChild(document.createTextNode(separator));
		}
	});
};

export const wrapElementChars = (element: HTMLElement): void => {
	const text = element.textContent || "";
	wrapTextParts(element, text.split(""), "inline-block");
};

export const wrapElementWords = (element: HTMLElement): void => {
	const text = element.textContent || "";
	wrapTextParts(element, text.split(/\s+/), "inline-block", " ");
};

export const wrapElementLines = (element: HTMLElement): void => {
	const text = element.textContent || "";
	wrapTextParts(element, text.split("\n"), "block");
};

export const wrapElement = (element: HTMLElement, type: "chars" | "words" | "lines"): void => {
	switch (type) {
		case "chars":
			wrapElementChars(element);
			break;
		case "words":
			wrapElementWords(element);
			break;
		case "lines":
			wrapElementLines(element);
			break;
	}
};
