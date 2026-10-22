// ============================================================================
// Shared Kernel - Number Utilities
// ============================================================================

export const isPositive = (num: number): boolean => num > 0;

export const isNegative = (num: number): boolean => num < 0;

export const isZero = (num: number): boolean => num === 0;

export const isGreaterThan =
	(threshold: number) =>
	(num: number): boolean =>
		num > threshold;

export const isLessThan =
	(threshold: number) =>
	(num: number): boolean =>
		num < threshold;
