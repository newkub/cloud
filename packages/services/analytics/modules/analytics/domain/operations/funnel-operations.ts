/**
 * Funnel Domain Operations
 * Pure functions for funnel analysis business logic
 */

import type {
	Event,
	Funnel,
	FunnelStep,
	Result,
} from "#analytics/modules/analytics/types";
import { err, ok } from "#analytics/shared/utils/result";

export const createFunnel = (
	data: Readonly<{
		id: string;
		name: string;
		steps: readonly string[];
		events: readonly Event[];
	}>,
): Result<Funnel> => {
	if (!data.name || typeof data.name !== "string") {
		return err(new Error("Funnel name is required"));
	}

	if (!data.steps || data.steps.length === 0) {
		return err(new Error("At least one funnel step is required"));
	}

	const steps = calculateFunnelSteps(data.steps, data.events);
	const totalUsers = steps[0]?.count ?? 0;
	const overallConversionRate =
		steps.length > 1
			? (steps[steps.length - 1]?.count ?? 0 / totalUsers) * 100
			: 100;

	return ok({
		id: data.id,
		name: data.name,
		steps,
		totalUsers,
		overallConversionRate,
	});
};

export const calculateFunnelSteps = (
	stepNames: readonly string[],
	events: readonly Event[],
): readonly FunnelStep[] => {
	const steps: FunnelStep[] = [];
	const uniqueUsers = new Set<string>();

	for (let i = 0; i < stepNames.length; i++) {
		const stepName = stepNames[i];
		if (!stepName) continue;

		const stepEvents = events.filter((event) => event.name === stepName);
		const stepUsers = new Set<string>();

		stepEvents.forEach((event) => {
			if (event.userId) {
				stepUsers.add(event.userId);
			}
		});

		const count = stepUsers.size;
		const conversionRate = i === 0 ? 100 : (count / uniqueUsers.size) * 100;
		const dropoffRate =
			i === 0 ? 0 : ((uniqueUsers.size - count) / uniqueUsers.size) * 100;

		steps.push({
			name: stepName,
			stepNumber: i + 1,
			count,
			conversionRate,
			dropoffRate,
		});

		uniqueUsers.forEach((userId) => {
			stepUsers.add(userId);
		});
		stepUsers.forEach((userId) => {
			uniqueUsers.add(userId);
		});
	}

	return steps;
};

export const calculateConversionRate = (
	fromStep: string,
	toStep: string,
	events: readonly Event[],
): Result<number> => {
	const fromEvents = events.filter((event) => event.name === fromStep);
	const toEvents = events.filter((event) => event.name === toStep);

	if (fromEvents.length === 0) {
		return err(new Error(`No events found for step: ${fromStep}`));
	}

	const fromUsers = new Set(fromEvents.map((e) => e.userId).filter(Boolean));
	const toUsers = new Set(toEvents.map((e) => e.userId).filter(Boolean));

	return ok((toUsers.size / fromUsers.size) * 100);
};

export const getFunnelInsights = (funnel: Funnel): string[] => {
	const insights: string[] = [];

	if (
		funnel.overallConversionRate !== undefined &&
		funnel.overallConversionRate < 10
	) {
		insights.push(
			"Low overall conversion rate - consider optimizing user flow",
		);
	}

	const biggestDropoff = funnel.steps.reduce(
		(max, step, index) => {
			if (index === 0) return max;
			return (step.dropoffRate ?? 0) > (max.dropoffRate ?? 0) ? step : max;
		},
		funnel.steps[0] ?? {
			name: "",
			count: 0,
			conversionRate: 0,
			dropoffRate: 0,
		},
	);

	if (
		biggestDropoff &&
		biggestDropoff.dropoffRate !== undefined &&
		biggestDropoff.dropoffRate > 50
	) {
		insights.push(
			`Major dropoff at "${biggestDropoff.name}" - investigate user experience issues`,
		);
	}

	const stepsWithLowConversion = funnel.steps.filter(
		(step) =>
			step.conversionRate !== undefined &&
			step.conversionRate < 20 &&
			step !== funnel.steps[0],
	);

	if (stepsWithLowConversion.length > 0) {
		insights.push(
			`Multiple steps with low conversion: ${stepsWithLowConversion.map((s) => s.name).join(", ")}`,
		);
	}

	return insights;
};

export const funnelToObject = (funnel: Funnel): Record<string, unknown> => ({
	name: funnel.name,
	steps: funnel.steps.map((step) => ({
		name: step.name,
		count: step.count,
		conversionRate: step.conversionRate,
		dropoffRate: step.dropoffRate,
	})),
	totalUsers: funnel.totalUsers,
	overallConversionRate: funnel.overallConversionRate,
});
