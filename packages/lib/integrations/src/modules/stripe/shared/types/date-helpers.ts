// ============================================================================
// Shared Kernel - Date Utilities
// ============================================================================

export const now = (now: number = Date.now()): Date => new Date(now);

export const toISOString = (date: Date): string => date.toISOString();

export const parseISO = (isoString: string): Date => new Date(isoString);
