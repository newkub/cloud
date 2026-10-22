/**
 * Shared animation adapter base logic
 * Extracted common logic used across React, Solid, and Svelte adapters
 */

import type {
	AnimationCallback,
	AnimationInstance,
	AnimationParameters,
	AnimationTarget,
	AnimationValue,
} from "../modules/animation/types";
import { createAnimationAdapter } from "./adapter-base";

/**
 * Common animation state management
 */
export interface AnimationAdapterState {
	animation: AnimationInstance | null;
	isPlaying: boolean;
	progress: number;
}

/**
 * Common animation controls
 */
export interface AnimationAdapterControls {
	play: () => void;
	pause: () => void;
	reverse: () => void;
	restart: () => void;
	cancel: () => void;
	seek: (time: number) => void;
}

/**
 * Create animation instance with common callback handling
 */
export function createAnimationWithCallbacks(
	targets: AnimationTarget,
	properties: Record<string, AnimationValue>,
	parameters: AnimationParameters,
	callbacks: AnimationCallback,
	onStateChange?: (state: Partial<AnimationAdapterState>) => void,
): AnimationInstance {
	const anim = createAnimationAdapter(targets, properties, parameters, {
		...callbacks,
		onUpdate: (animInstance: AnimationInstance) => {
			onStateChange?.({ progress: animInstance.progress });
			callbacks.onUpdate?.(animInstance);
		},
		onBegin: () => {
			onStateChange?.({ isPlaying: true });
			callbacks.onBegin?.();
		},
		onComplete: () => {
			onStateChange?.({ isPlaying: false });
			callbacks.onComplete?.();
		},
	});

	return anim;
}

/**
 * Common cleanup logic
 */
export function cleanupAnimation(animation: AnimationInstance | null): void {
	animation?.cancel();
}
