/**
 * Calculate Retention Use Case
 * Handles cohort retention analysis
 */

import {
	calculateRetention,
	createCohort,
} from "#analytics/modules/analytics/domain/operations";
import type { Cohort } from "#analytics/modules/analytics/domain/operations/retention-operations";
import type { Event, Result, User } from "#analytics/modules/analytics/types";
import { err, isErr, isOk, ok } from "#analytics/shared/utils/result";

export type RetentionCommand = Readonly<{
	cohortDate: string;
	periodDays: number;
	totalPeriods?: number;
}>;

export type RetentionDependencies = Readonly<{
	eventRepository: EventRepository;
	userRepository: UserRepository;
}>;

export interface EventRepository {
	findByDateRange(
		start: number,
		end: number,
	): Promise<Result<readonly Event[]>>;
}

export interface UserRepository {
	findAll(): Promise<Result<readonly User[]>>;
	findByDateRange(start: number, end: number): Promise<Result<readonly User[]>>;
}

export const calculateRetentionUseCase = async (
	dependencies: RetentionDependencies,
	command: RetentionCommand,
): Promise<Result<Cohort>> => {
	const { eventRepository, userRepository } = dependencies;

	// Create cohort
	const cohortResult = createCohort(
		{
			cohortDate: command.cohortDate,
			periodDays: command.periodDays,
			totalPeriods: command.totalPeriods || 10,
		},
		`cohort-${command.cohortDate}`,
	);

	if (!isOk(cohortResult)) {
		return err((cohortResult as { success: false; error: Error }).error);
	}

	let cohort = cohortResult.data;

	// Get users for cohort period
	const cohortStartTime = new Date(command.cohortDate).getTime();
	const cohortEndTime =
		cohortStartTime + command.periodDays * 24 * 60 * 60 * 1000;

	const usersResult = await userRepository.findByDateRange(
		cohortStartTime,
		cohortEndTime,
	);
	if (isErr(usersResult)) {
		return err(usersResult.error);
	}

	// Get events for retention calculation (extended period)
	const totalPeriods = command.totalPeriods || 10;
	const analysisEndTime =
		cohortEndTime + totalPeriods * command.periodDays * 24 * 60 * 60 * 1000;

	const eventsResult = await eventRepository.findByDateRange(
		cohortStartTime,
		analysisEndTime,
	);
	if (isErr(eventsResult)) {
		return err(eventsResult.error);
	}

	// Calculate retention
	cohort = calculateRetention(
		cohort,
		eventsResult.success ? eventsResult.data : [],
		usersResult.success ? usersResult.data : [],
	);

	return ok(cohort);
};

export const getRetentionAnalysis = async (
	dependencies: RetentionDependencies,
	command: RetentionCommand,
): Promise<
	Result<{
		cohort: Cohort;
		analysis: {
			averageRetention: number;
			bestPerformingPeriod: number;
			worstPerformingPeriod: number;
		};
	}>
> => {
	const cohortResult = await calculateRetentionUseCase(dependencies, command);
	if (!cohortResult.success) {
		return err(cohortResult.error);
	}

	const cohort = cohortResult.data;
	const rates = cohort.retentionRates;

	const analysis = {
		averageRetention:
			rates.length > 0
				? rates.reduce((acc: number, rate: number) => acc + rate, 0) /
					rates.length
				: 0,
		bestPerformingPeriod:
			rates.length > 0 ? rates.indexOf(Math.max(...rates)) + 1 : 0,
		worstPerformingPeriod:
			rates.length > 0 ? rates.indexOf(Math.min(...rates)) + 1 : 0,
	};

	return ok({
		cohort,
		analysis,
	});
};
