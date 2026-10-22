// ============================================================================
// Shared Kernel - String Utilities
// ============================================================================

export const isEmptyString = (str: string): boolean => str.length === 0;

export const isNotEmptyString = (str: string): boolean => str.length > 0;

export const trim = (str: string): string => str.trim();

export const toLowerCase = (str: string): string => str.toLowerCase();

export const toUpperCase = (str: string): string => str.toUpperCase();
