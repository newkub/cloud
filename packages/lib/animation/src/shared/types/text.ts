/**
 * Text splitting types
 */

export type TextSplitType = "chars" | "words" | "lines";

export interface TextSplitOptions {
	preserveSpaces?: boolean;
	trim?: boolean;
	type: TextSplitType;
}

export interface SplitTextResult {
	chars: string[];
	lines: string[];
	words: string[];
}
