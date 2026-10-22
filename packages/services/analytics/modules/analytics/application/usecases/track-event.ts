/**
 * Track Event Use Case
 * Handles event tracking with validation and persistence
 */

import {
	createEvent,
	createIdentify,
	createPageView,
	createRevenue,
} from "#analytics/modules/analytics/domain/operations";
import type {
	EventProcessor,
	EventRepository,
	IdGenerator,
	SessionRepository,
	TimeProvider,
} from "#analytics/modules/analytics/ports";
import type {
	Event,
	EventProperties,
	EventType,
	Result,
	SessionId,
	UserId,
	UTMParameters,
} from "#analytics/modules/analytics/types";
import { err, isErr, ok } from "#analytics/shared/utils/result";

export type TrackEventCommand = Readonly<{
	type: EventType;
	name?: string;
	properties?: EventProperties;
	sessionId: SessionId;
	userId?: UserId;
	utmParameters?: UTMParameters;
}>;

export type TrackEventDependencies = Readonly<{
	eventRepository: EventRepository;
	eventProcessor: EventProcessor;
	sessionRepository: SessionRepository;
	idGenerator: IdGenerator;
	timeProvider: TimeProvider;
}>;

export const trackEvent = async (
	dependencies: TrackEventDependencies,
	command: TrackEventCommand,
): Promise<Result<Event>> => {
	const {
		eventRepository,
		eventProcessor,
		sessionRepository,
		idGenerator,
		timeProvider,
	} = dependencies;

	const now = timeProvider.now();

	// Validate session exists
	const sessionResult = await sessionRepository.findById(command.sessionId);
	if (isErr(sessionResult)) {
		return err(sessionResult.error);
	}

	let session = sessionResult.success ? sessionResult.data : null;
	if (!session) {
		// Create new session if not exists
		const { createSession } = await import(
			"#analytics/modules/analytics/domain/operations"
		);
		const newSessionResult = createSession({
			id: command.sessionId,
			...(command.userId !== undefined && { userId: command.userId }),
			startTime: now,
			...(command.utmParameters !== undefined && {
				utmParameters: command.utmParameters,
			}),
		});
		if (isErr(newSessionResult)) {
			return err(newSessionResult.error);
		}

		const newSessionData = newSessionResult.success
			? newSessionResult.data
			: null;
		if (!newSessionData) {
			return err(new Error("Failed to create session"));
		}

		const saveSessionResult = await sessionRepository.save(newSessionData);
		if (isErr(saveSessionResult)) {
			return err(saveSessionResult.error);
		}
		session = saveSessionResult.success ? saveSessionResult.data : null;
	}

	// Create event based on type
	let eventResult: Result<Event>;
	const eventId = idGenerator.generate();

	switch (command.type) {
		case "page_view":
			if (!command.properties?.path) {
				return err(new Error("Path is required for page view events"));
			}
			eventResult = createPageView({
				path: command.properties.path as string,
				...(command.properties.title !== undefined && {
					title: command.properties.title as string,
				}),
				...(command.properties.referrer !== undefined && {
					referrer: command.properties.referrer as string,
				}),
				sessionId: command.sessionId,
				...(command.userId !== undefined && { userId: command.userId }),
				...(command.utmParameters !== undefined && {
					utmParameters: command.utmParameters,
				}),
				id: eventId,
				timestamp: now,
			});
			break;

		case "identify":
			if (!command.userId) {
				return err(new Error("User ID is required for identify events"));
			}
			eventResult = createIdentify({
				userId: command.userId,
				...(command.properties?.email !== undefined && {
					email: command.properties.email as string,
				}),
				...(command.properties?.name !== undefined && {
					name: command.properties.name as string,
				}),
				...(command.properties !== undefined && {
					properties: command.properties,
				}),
				sessionId: command.sessionId,
				id: eventId,
				timestamp: now,
			});
			break;

		case "revenue":
			if (!command.properties?.amount) {
				return err(new Error("Amount is required for revenue events"));
			}
			eventResult = createRevenue({
				amount: command.properties.amount as number,
				...(command.properties.currency !== undefined && {
					currency: command.properties.currency as string,
				}),
				...(command.properties.product !== undefined && {
					product: command.properties.product as string,
				}),
				...(command.properties.orderId !== undefined && {
					orderId: command.properties.orderId as string,
				}),
				...(command.properties !== undefined && {
					properties: command.properties,
				}),
				sessionId: command.sessionId,
				...(command.userId !== undefined && { userId: command.userId }),
				id: eventId,
				timestamp: now,
			});
			break;

		default:
			eventResult = createEvent({
				id: eventId,
				name: (command.name || command.type) as EventType,
				...(command.properties !== undefined && {
					properties: command.properties,
				}),
				sessionId: command.sessionId,
				...(command.userId !== undefined && { userId: command.userId }),
				timestamp: now,
				...(command.utmParameters !== undefined && {
					utmParameters: command.utmParameters,
				}),
			});
	}

	if (!eventResult.success) {
		return err(eventResult.error);
	}

	const event = eventResult.data;

	// Validate event
	const validationResult = eventProcessor.validate(event);
	if (isErr(validationResult)) {
		return err(validationResult.error);
	}

	// Process event
	const processResult = await eventProcessor.process(event);
	if (isErr(processResult)) {
		return err(processResult.error);
	}

	// Save event
	const saveResult = await eventRepository.save(event);
	if (!saveResult.success) {
		return err(saveResult.error);
	}

	return ok(saveResult.data);
};
