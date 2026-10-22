/**
 * Calculate Funnel Use Case
 * Handles funnel analysis calculations
 */

import {
	calculateConversionRate,
	createFunnel,
	getFunnelInsights,
} from "#analytics/modules/analytics/domain/operations";
import type { Event, Funnel, Result } from "#analytics/modules/analytics/types";
import { err, isErr, ok } from "#analytics/shared/utils/result";

export type CalculateFunnelCommand = Readonly<{
	name: string;
	steps: readonly string[];
	dateRange?: {
		start: number;
		end: number;
	};
	filters?: {
		userId?: string;
		properties?: Record<string, unknown>;
	};
}>;

export type CalculateFunnelDependencies = Readonly<{
	eventRepository: FunnelEventRepository;
}>;

export interface FunnelEventRepository {
	findByDateRange(
		start: number,
		end: number,
		filters?: EventFilters,
	): Promise<Result<readonly Event[]>>;
	findByEventNames(
		names: readonly string[],
		filters?: EventFilters,
	): Promise<Result<readonly Event[]>>;
}

export interface EventFilters {
	userId?: string;
	properties?: Record<string, unknown>;
}

export const calculateFunnel = async (
	dependencies: CalculateFunnelDependencies,
	command: CalculateFunnelCommand,
	randomUUID: () => string = (
		randomUUID: () => string = () => crypto.randomUUID(),
	) => randomUUID(),
): Promise<Result<Funnel>> => {
	const { eventRepository } = dependencies;

	// Get events for funnel calculation
	let eventsResult: Result<readonly Event[]>;

	if (command.dateRange) {
		eventsResult = await eventRepository.findByDateRange(
			command.dateRange.start,
			command.dateRange.end,
			command.filters,
		);
	} else {
		eventsResult = await eventRepository.findByEventNames(
			command.steps,
			command.filters,
		);
	}

	if (isErr(eventsResult)) {
		return err(eventsResult.error);
	}

	const events = eventsResult.success ? eventsResult.data : [];

	// Filter events by funnel steps
	const funnelEvents = events.filter((event: Event) =>
		command.steps.includes(event.name),
	);

	// Create funnel
	const funnelResult = createFunnel({
		id: randomUUID(),
		name: command.name,
		steps: command.steps,
		events: funnelEvents,
	});

	if (!funnelResult.success) {
		return err(funnelResult.error);
	}

	return ok(funnelResult.data);
};

export const getFunnelConversionRate = async (
	dependencies: CalculateFunnelDependencies,
	fromStep: string,
	toStep: string,
	filters?: EventFilters,
): Promise<Result<number>> => {
	const { eventRepository } = dependencies;

	const eventsResult = await eventRepository.findByEventNames(
		[fromStep, toStep],
		filters,
	);
	if (isErr(eventsResult)) {
		return err(eventsResult.error);
	}

	return calculateConversionRate(
		fromStep,
		toStep,
		eventsResult.success ? eventsResult.data : [],
	);
};

export const getFunnelAnalysis = async (
	dependencies: CalculateFunnelDependencies,
	command: CalculateFunnelCommand,
): Promise<
	Result<{
		funnel: Funnel;
		insights: readonly string[];
		conversionRates: Record<string, number>;
	}>
> => {
	const funnelResult = await calculateFunnel(dependencies, command);
	if (!funnelResult.success) {
		return err(funnelResult.error);
	}

	const funnel = funnelResult.data;
	const insights = getFunnelInsights(funnel);

	// Calculate step-to-step conversion rates
	const conversionRates: Record<string, number> = {};

	for (let i = 0; i < command.steps.length - 1; i++) {
		const fromStep = command.steps[i];
		const toStep = command.steps[i + 1];
		if (!fromStep || !toStep) continue;

		const rateResult = await getFunnelConversionRate(
			dependencies,
			fromStep,
			toStep,
			command.filters,
		);

		if (rateResult.success) {
			conversionRates[`${fromStep}_to_${toStep}`] = rateResult.data;
		}
	}

	return ok({
		funnel,
		insights,
		conversionRates,
	});
};
