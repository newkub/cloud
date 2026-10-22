/**
 * Timeline Editor Types
 */

export interface TimelineEditorOptions {
	showTimeline?: boolean;
	showControls?: boolean;
	allowDrag?: boolean;
	allowResize?: boolean;
}

export interface TimelineTrack {
	id: string;
	name: string;
	keyframes: Keyframe[];
	color?: string;
}

export interface Keyframe {
	time: number;
	value: Record<string, unknown>;
	easing?: string;
}
