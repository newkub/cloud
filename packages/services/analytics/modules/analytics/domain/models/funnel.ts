/**
 * Funnel Domain Model
 * Analytics funnel domain types
 */

export type FunnelStep = Readonly<{
	name: string;
	stepNumber: number;
	count?: number;
	conversionRate?: number;
	dropoffRate?: number;
}>;

export type Funnel = Readonly<{
	id: string;
	name: string;
	steps: readonly FunnelStep[];
	overallConversionRate?: number;
	totalUsers?: number;
}>;
