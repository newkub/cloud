/**
 * Search Highlight Utility
 * Highlights matched text in search results
 */

import type { HighlightRange, SearchHighlight } from "../types";

/**
 * Find all occurrences of a query in text
 */
export function findHighlightRanges(text: string, query: string): readonly HighlightRange[] {
	if (!query || !text) return [];

	const ranges: HighlightRange[] = [];
	const lowerText = text.toLowerCase();
	const lowerQuery = query.toLowerCase();
	let index = 0;

	while (true) {
		index = lowerText.indexOf(lowerQuery, index);
		if (index === -1) break;
		ranges.push({ start: index, end: index + query.length });
		index += query.length;
	}

	return ranges;
}

/**
 * Create a search highlight with ranges
 */
export function createSearchHighlight(text: string, query: string): SearchHighlight {
	return {
		text,
		highlights: findHighlightRanges(text, query),
	};
}

/**
 * Render highlighted text with markup
 */
export function renderHighlightedText(highlight: SearchHighlight, highlightClass: string = "highlight"): string {
	if (highlight.highlights.length === 0) {
		return highlight.text;
	}

	let result = "";
	let lastIndex = 0;

	for (const range of highlight.highlights) {
		// Add text before highlight
		result += highlight.text.slice(lastIndex, range.start);
		// Add highlighted text
		result += `<span class="${highlightClass}">${highlight.text.slice(range.start, range.end)}</span>`;
		lastIndex = range.end;
	}

	// Add remaining text
	result += highlight.text.slice(lastIndex);

	return result;
}

/**
 * Get highlighted text for command label or description
 */
export function getHighlightedText(text: string | undefined, query: string): string {
	if (!text) return "";
	const highlight = createSearchHighlight(text, query);
	return renderHighlightedText(highlight);
}
