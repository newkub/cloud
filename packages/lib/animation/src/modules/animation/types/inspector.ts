/**
 * Animation Inspector Types
 */

export interface AnimationInspectorData {
	target: import("./animation-instance").AnimationTarget;
	properties: Record<string, unknown>;
	currentValues: Record<string, number>;
	progress: number;
	isPlaying: boolean;
	duration: number;
	easing?: string;
}

export interface InspectorOptions {
	showOverlay?: boolean;
	showTimeline?: boolean;
	showProperties?: boolean;
}
