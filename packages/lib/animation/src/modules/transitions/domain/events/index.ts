// Transitions Domain Events
// Domain event types for transition operations

import type { TransitionMode, TransitionOptions } from "../models";

export type TransitionEventType =
	| "transitionStarted"
	| "transitionCompleted"
	| "transitionCancelled"
	| "transitionFailed"
	| "transitionPaused"
	| "transitionResumed"
	| "stateChanged"
	| "stateReset"
	| "animationStarted"
	| "animationEnded";

export interface TransitionEventData {
	mode?: TransitionMode;
	options?: TransitionOptions;
	oldState?: string;
	newState?: string;
	transitionName?: string;
	animationName?: string;
	duration?: number;
	error?: Error;
	progress?: number;
}

export interface TransitionEvent {
	type: TransitionEventType;
	data: TransitionEventData;
	timestamp: number;
}
