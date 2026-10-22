/**
 * Animation Parameters and State Types
 */

export interface AnimationParameters {
	id?: string;
	duration?: number;
	delay?: number;
	easing?: string | EasingFunction;
	direction?: AnimationDirection;
	iterations?: number;
	loop?: boolean | number;
	fill?: AnimationFill;
	autoplay?: boolean;
}

export type AnimationPlayState = "idle" | "running" | "paused" | "finished";

export interface AnimationCallback {
	onBegin?: () => void;
	onUpdate?: (instance: import("./animation-instance").AnimationInstance) => void;
	onComplete?: () => void;
	onCancel?: () => void;
}

export type EasingFunction = (t: number) => number;

// Re-export from domain models
export type AnimationDirection = "normal" | "reverse" | "alternate";
export type AnimationFill = "forwards" | "backwards" | "both" | "none";
