// ============================================================================
// Subscription Module - Plan Management Use Cases (Pure Functions)
// ============================================================================

import {
	createPlanCreatedEvent,
	createPlanDeletedEvent,
	createPlanUpdatedEvent,
} from "../../domain/events/subscription-events";
import {
	validateCreatePlanRequest,
	validateUpdatePlanRequest,
} from "../../domain/validators/validation";
import type {
	SubscriptionEventPublisher,
	SubscriptionPlanRepository,
} from "../../ports/subscription-repository";
import type {
	CreatePlanRequest,
	Result,
	SubscriptionPlan,
	UpdatePlanRequest,
} from "../../types";

// Helper functions for Result type
const success = <T>(data: T): Result<T> => ({
	success: true,
	data,
});

const failure = <E>(error: E): Result<never, E> => ({
	success: false,
	error,
});

export type PlanManagementDependencies = {
	readonly planRepository: SubscriptionPlanRepository;
	readonly eventPublisher: SubscriptionEventPublisher;
};

// Pure validation functions
const validateAndCreatePlan = async (
	request: CreatePlanRequest,
	deps: PlanManagementDependencies,
	id: string,
	now: string,
): Promise<Result<SubscriptionPlan>> => {
	const validationResult = validateCreatePlanRequest(request);
	if (!validationResult.success) {
		return failure(
			new Error(
				`Validation failed: ${validationResult.errors.map((e) => e.message).join(", ")}`,
			),
		);
	}

	try {
		const planData = {
			...validationResult.data,
			isActive: validationResult.data.isActive ?? true,
		};
		const createdPlan = await deps.planRepository.createPlan(planData);

		// Publish domain event
		const event = createPlanCreatedEvent(createdPlan, id, now);
		await deps.eventPublisher.publish(event);

		return success(createdPlan);
	} catch (error) {
		return failure(
			error instanceof Error
				? error
				: new Error(`Failed to create plan: ${error}`),
		);
	}
};

const validateAndUpdatePlan = async (
	id: string,
	request: UpdatePlanRequest,
	deps: PlanManagementDependencies,
	eventId: string,
	now: string,
): Promise<Result<SubscriptionPlan>> => {
	const validationResult = validateUpdatePlanRequest(request);
	if (!validationResult.success) {
		return failure(
			new Error(
				`Validation failed: ${validationResult.errors.map((e) => e.message).join(", ")}`,
			),
		);
	}

	try {
		const existingPlan = await deps.planRepository.getPlan(id);
		if (!existingPlan) {
			return failure(new Error(`Plan with id ${id} not found`));
		}

		const updatedPlan = await deps.planRepository.updatePlan(
			id,
			validationResult.data,
		);

		// Publish domain event
		const event = createPlanUpdatedEvent(
			id,
			existingPlan,
			updatedPlan,
			eventId,
			now,
		);
		await deps.eventPublisher.publish(event);

		return success(updatedPlan);
	} catch (error) {
		return failure(
			error instanceof Error
				? error
				: new Error(`Failed to update plan: ${error}`),
		);
	}
};

const validateAndDeletePlan = async (
	id: string,
	deps: PlanManagementDependencies,
	eventId: string,
	now: string,
): Promise<Result<void>> => {
	try {
		const existingPlan = await deps.planRepository.getPlan(id);
		if (!existingPlan) {
			return failure(new Error(`Plan with id ${id} not found`));
		}

		await deps.planRepository.deletePlan(id);

		// Publish domain event
		const event = createPlanDeletedEvent(existingPlan, eventId, now);
		await deps.eventPublisher.publish(event);

		return success(undefined);
	} catch (error) {
		return failure(
			error instanceof Error
				? error
				: new Error(`Failed to delete plan: ${error}`),
		);
	}
};

// Use case functions
export const createPlan =
	(deps: PlanManagementDependencies) =>
	async (
		request: CreatePlanRequest,
		id: string,
		now: string,
	): Promise<SubscriptionPlan> => {
		const result = await validateAndCreatePlan(request, deps, id, now);
		if (!result.success) {
			throw result.error;
		}
		return result.data;
	};

export const updatePlan =
	(deps: PlanManagementDependencies) =>
	async (
		id: string,
		request: UpdatePlanRequest,
		eventId: string,
		now: string,
	): Promise<SubscriptionPlan> => {
		const result = await validateAndUpdatePlan(id, request, deps, eventId, now);
		if (!result.success) {
			throw result.error;
		}
		return result.data;
	};

export const deletePlan =
	(deps: PlanManagementDependencies) =>
	async (id: string, eventId: string, now: string): Promise<void> => {
		const result = await validateAndDeletePlan(id, deps, eventId, now);
		if (!result.success) {
			throw result.error;
		}
	};

export const getPlan =
	(deps: PlanManagementDependencies) =>
	async (id: string): Promise<SubscriptionPlan | null> => {
		return deps.planRepository.getPlan(id);
	};

export const getPlansByOrganization =
	(deps: PlanManagementDependencies) =>
	async (organizationId: string): Promise<readonly SubscriptionPlan[]> => {
		return deps.planRepository.getPlansByOrganization(organizationId);
	};

export const getAllPlans =
	(deps: PlanManagementDependencies) =>
	async (): Promise<readonly SubscriptionPlan[]> => {
		return deps.planRepository.getAllPlans();
	};

export const getActivePlans =
	(deps: PlanManagementDependencies) =>
	async (): Promise<readonly SubscriptionPlan[]> => {
		return deps.planRepository.getActivePlans();
	};

export const togglePlanStatus =
	(deps: PlanManagementDependencies) =>
	async (
		id: string,
		isActive: boolean,
		eventId: string,
		now: string,
	): Promise<SubscriptionPlan> => {
		return updatePlan(deps)(id, { isActive }, eventId, now);
	};
