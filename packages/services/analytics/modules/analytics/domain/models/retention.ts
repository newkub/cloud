/**
 * Retention Domain Model
 * Analytics retention domain type
 */

export type RetentionData = Readonly<{
	cohort: string;
	day: number;
	percentage: number;
	totalUsers?: number;
	retentionRates?: number[];
}>;
