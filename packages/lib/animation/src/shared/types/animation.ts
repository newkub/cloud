/**
 * Core animation types following Clean Architecture
 * Re-export from domain to avoid duplication
 */
export type {
	AnimationCallback,
	AnimationDirection,
	AnimationInstance,
	AnimationParameters,
	AnimationPlayState,
	AnimationTarget,
	AnimationValue,
	TimelineInstance,
} from "../../modules/animation/types";

export interface AnimatableProperty {
	from?: unknown;
	to?: unknown;
	unit?: string;
	value: unknown;
}
