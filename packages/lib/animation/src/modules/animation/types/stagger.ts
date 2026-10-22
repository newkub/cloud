/**
 * Advanced Staggering Types
 */

export interface StaggerOptions {
	from?: number | "first" | "last" | "center" | "edges" | "index";
	direction?: "normal" | "reverse";
	grid?: [number, number] | { columns: number; rows: number };
	axis?: "x" | "y";
	random?: () => number;
	easing?: string | import("./animation-parameters").EasingFunction;
}

export interface StaggerValue {
	value: number | number[];
	options?: StaggerOptions;
}

export type StaggerFunction = (index: number) => number;
