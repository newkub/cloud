/**
 * Reverse Engineering Types
 */

export interface ReverseEngineeringOptions {
	target: import("./animation-instance").AnimationTarget;
	includeTransform?: boolean;
	includeOpacity?: boolean;
	includeFilters?: boolean;
}

export interface AnimationCode {
	language: "typescript" | "javascript" | "solidjs";
	code: string;
}
