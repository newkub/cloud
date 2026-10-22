/**
 * Shared constants used across the animation library
 */

export const ANIMATION_DEFAULTS = {
	duration: 1000,
	easing: "ease-out",
	delay: 0,
} as const;

export const PERFORMANCE_THRESHOLDS = {
	maxFPS: 60,
	minFPS: 30,
	frameTime: 16.67, // 1000ms / 60fps
} as const;

export const DOM_EVENTS = {
	CLICK: "click",
	RESIZE: "resize",
	SCROLL: "scroll",
	LOAD: "load",
	UNLOAD: "unload",
} as const;

export const ANIMATION_STATES = {
	IDLE: "idle",
	RUNNING: "running",
	PAUSED: "paused",
	COMPLETED: "completed",
	CANCELLED: "cancelled",
} as const;

export const EASING_PRESETS = {
	LINEAR: "linear",
	EASE_IN: "ease-in",
	EASE_OUT: "ease-out",
	EASE_IN_OUT: "ease-in-out",
	EASE_IN_QUAD: "ease-in-quad",
	EASE_OUT_QUAD: "ease-out-quad",
	EASE_IN_OUT_QUAD: "ease-in-out-quad",
} as const;
