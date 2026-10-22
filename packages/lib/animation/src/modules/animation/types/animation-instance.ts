/**
 * Animation Instance Types
 * Runtime instance types for animations and timelines
 */

import type { AnimationParameters } from "./animation-parameters.js";

export interface AnimationInstance {
	id: string;
	target: AnimationTarget;
	properties: AnimationProperties;
	options: AnimationParameters;
	state: AnimationPlayState;
	progress: number;
	currentTime: number;
	duration: number;
	play(): void;
	pause(): void;
	reverse(): void;
	restart(): void;
	cancel(): void;
	seek(time: number): void;
	onComplete?(callback: () => void): void;
}

export interface TimelineInstance {
	id: string;
	animations: AnimationInstance[];
	options: TimelineOptions;
	state: TimelineState;
	progress: number;
	currentTime: number;
	totalDuration: number;
	duration: number;
	add(anim: AnimationInstance | string, time?: number): TimelineInstance;
	remove(animationId: string): TimelineInstance;
	play(): void;
	pause(): void;
	reverse(): void;
	restart(): void;
	cancel(): void;
	seek(time: number): void;
	onComplete?(callback: () => void): void;
}

// Re-export from domain models
export type AnimationTarget = string | Element | object;
export type AnimationDirection = "normal" | "reverse" | "alternate";
export type AnimationFill = "forwards" | "backwards" | "both" | "none";
export interface AnimationProperties {
	x?: number;
	y?: number;
	rotate?: number | string;
	scale?: number;
	opacity?: number;
	backgroundColor?: string;
	color?: string;
	width?: number | string;
	height?: number | string;
	[key: string]: unknown;
}
export interface AnimationOptions {
	duration?: number;
	delay?: number;
	easing?: string;
	direction?: AnimationDirection;
	iterations?: number;
	fill?: AnimationFill;
}
export interface AnimationState {
	isPlaying: boolean;
	isPaused: boolean;
	isFinished: boolean;
	progress: number;
	currentTime: number;
}
export interface TimelineOptions {
	id?: string;
	duration?: number;
}
export interface TimelineState {
	isPlaying: boolean;
	isPaused: boolean;
	progress: number;
	currentTime: number;
}
