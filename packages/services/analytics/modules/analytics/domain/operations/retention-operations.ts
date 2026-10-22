/**
 * Retention Domain Operations
 * Pure functions for cohort retention analysis
 */

import type { Event, Result, User } from "#analytics/modules/analytics/types";
import { err, ok } from "#analytics/shared/utils/result";

export type Cohort = Readonly<{
	id: string;
	cohortDate: string;
	cohortSize: number;
	retentionRates: readonly number[];
	periodDays: number;
}>;

export type RetentionConfig = Readonly<{
	cohortDate: string;
	periodDays: number;
	totalPeriods: number;
}>;

export const createCohort = (
	config: RetentionConfig,
	id: string,
): Result<Cohort> => {
	if (!config.cohortDate) {
		return err(new Error("Cohort date is required"));
	}

	if (config.periodDays <= 0) {
		return err(new Error("Period days must be positive"));
	}

	return ok({
		id,
		cohortDate: config.cohortDate,
		cohortSize: 0,
		retentionRates: [],
		periodDays: config.periodDays,
	});
};

export const calculateRetention = (
	cohort: Cohort,
	events: readonly Event[],
	users: readonly User[],
): Cohort => {
	const cohortStartTime = new Date(cohort.cohortDate).getTime();
	const cohortEndTime =
		cohortStartTime + cohort.periodDays * 24 * 60 * 60 * 1000;

	// Find users who were active in the cohort period (first time users)
	const cohortUsers = users.filter((user) => {
		if (!user.firstSeen) return false;
		const userFirstSeen = new Date(user.firstSeen).getTime();
		return userFirstSeen >= cohortStartTime && userFirstSeen < cohortEndTime;
	});

	const cohortSize = cohortUsers.length;
	const retentionRates: number[] = [];

	if (cohortSize === 0) {
		return {
			...cohort,
			cohortSize: 0,
			retentionRates: [],
		};
	}

	const cohortUserIds = new Set(cohortUsers.map((u) => u.id));

	// Calculate retention for each period
	for (
		let period = 1;
		period <= cohort.retentionRates.length || period <= 10;
		period++
	) {
		const periodStart =
			cohortEndTime + (period - 1) * cohort.periodDays * 24 * 60 * 60 * 1000;
		const periodEnd = periodStart + cohort.periodDays * 24 * 60 * 60 * 1000;

		// Find users who had events in this period
		const activeUsers = new Set<string>();
		for (const event of events) {
			const eventTime = event.timestamp;
			if (eventTime >= periodStart && eventTime < periodEnd) {
				if (cohortUserIds.has(event.userId || "")) {
					activeUsers.add(event.userId || "");
				}
			}
		}

		const retentionRate = (activeUsers.size / cohortSize) * 100;
		retentionRates.push(Math.round(retentionRate * 100) / 100);
	}

	return {
		...cohort,
		cohortSize,
		retentionRates,
	};
};

export const getAverageRetentionRate = (cohort: Cohort): number => {
	if (cohort.retentionRates.length === 0) {
		return 0;
	}
	const sum = cohort.retentionRates.reduce((acc, rate) => acc + rate, 0);
	return Math.round((sum / cohort.retentionRates.length) * 100) / 100;
};

export const getRetentionAtPeriod = (
	cohort: Cohort,
	period: number,
): number => {
	if (period <= 0 || period > cohort.retentionRates.length) {
		return 0;
	}
	return cohort.retentionRates[period - 1] || 0;
};

export const cohortToObject = (cohort: Cohort): Record<string, unknown> => ({
	id: cohort.id,
	cohortDate: cohort.cohortDate,
	cohortSize: cohort.cohortSize,
	retentionRates: cohort.retentionRates,
	periodDays: cohort.periodDays,
	averageRetentionRate: getAverageRetentionRate(cohort),
});
