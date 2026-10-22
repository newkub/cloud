/**
 * Domain types - Central type definitions for the animation library
 * Barrel export for all animation types
 */

// Animation instance types
export type {
	AnimationDirection,
	AnimationFill,
	AnimationInstance,
	AnimationOptions,
	AnimationProperties,
	AnimationState,
	AnimationTarget,
	TimelineInstance,
	TimelineOptions,
	TimelineState,
} from "./animation-instance.js";

// Animation parameters and state
export type {
	AnimationCallback,
	AnimationParameters,
	AnimationPlayState,
	EasingFunction,
} from "./animation-parameters.js";
// Audio reactive
export type { AudioData, AudioReactiveOptions } from "./audio-reactive.js";
// Animation chaining
export type { ChainInstance } from "./chain.js";
// GSAP compatibility
export type { GSAPLikeOptions, GSAPLikeTarget } from "./gsap.js";
// Inspector
export type { AnimationInspectorData, InspectorOptions } from "./inspector.js";
// Kinetic typography
export type { KineticTypographyOptions } from "./kinetic-typography.js";
// Lottie
export type { LottieInstance, LottieOptions } from "./lottie.js";
// Motion capture
export type { MotionCaptureOptions, MotionData } from "./motion-capture.js";
// Motion path
export type {
	MotionPathInstance,
	MotionPathOptions,
	MotionPathPoint,
} from "./motion-path.js";

// Performance profiling
export type {
	AnimationPerformanceMetrics,
	PerformanceProfile,
} from "./performance.js";

// Responsive animations
export type { ResponsiveOptions } from "./responsive.js";
// Reverse engineering
export type {
	AnimationCode,
	ReverseEngineeringOptions,
} from "./reverse-engineering.js";
// Shader effects
export type { ShaderEffectOptions, ShaderUniform } from "./shader-effects.js";
// Spring animation
export type { SpringOptions, SpringState } from "./spring.js";
// Staggering
export type {
	StaggerFunction,
	StaggerOptions,
	StaggerValue,
} from "./stagger.js";
// Timeline editor
export type {
	Keyframe,
	TimelineEditorOptions,
	TimelineTrack,
} from "./timeline-editor.js";
// 3D transforms
export type { Transform3D, Transform3DOptions } from "./transform-3d.js";
// Video export
export type {
	VideoExportOptions,
	VideoExportProgress,
} from "./video-export.js";
// WebGL
export type { WebGLRendererOptions, WebGLShader } from "./webgl.js";

// Additional animation value type
export type AnimationValue = string | number | boolean | null | undefined | unknown[] | Record<string, unknown>;

// AI Animation Generator types
import type { AnimationTarget } from "./animation-instance.js";

export interface AIAnimationOptions {
	prompt: string;
	target: AnimationTarget;
	duration?: number;
	easing?: string;
	style?: "bounce" | "elastic" | "smooth" | "linear";
}

export interface GeneratedAnimation {
	properties: Record<string, unknown>;
	duration: number;
	easing: string;
	keyframes: Array<{ time: number; value: Record<string, unknown> }>;
}
