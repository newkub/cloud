/**
 * Use case: Motion Path Animation
 * Creates and manages path-based animations
 */

import {
	createMotionPath as createPath,
	getMotionPathPoints,
	getPointAtProgress,
} from "../../../domain/models/input-media/motion-path";
import type { AnimationTarget, MotionPathInstance, MotionPathOptions } from "../../../types/index";

export function createMotionPath(target: AnimationTarget, options: MotionPathOptions, id: string): MotionPathInstance {
	const motionPath = createPath(options);
	let progress = 0;
	let isPlaying = false;
	let animationFrameId: number | null = null;
	let startTime: number | null = null;
	const duration = 1000; // Default duration

	const update = (timestamp: number) => {
		if (!startTime) startTime = timestamp;
		const elapsed = timestamp - startTime;
		progress = Math.min(elapsed / duration, 1);

		const point = getPointAtProgress(motionPath, progress);
		applyToTarget(target, point);

		if (progress < 1 && isPlaying) {
			animationFrameId = requestAnimationFrame(update);
		} else if (progress >= 1) {
			isPlaying = false;
		}
	};

	const applyToTarget = (target: AnimationTarget, point: { x: number; y: number; angle?: number }) => {
		if (typeof target === "string") {
			const element = document.querySelector(target) as HTMLElement;
			if (element) {
				element.style.transform = `translate(${point.x}px, ${point.y}px)${point.angle !== undefined ? ` rotate(${point.angle}rad)` : ""}`;
			}
		} else if (target instanceof HTMLElement) {
			target.style.transform = `translate(${point.x}px, ${point.y}px)${point.angle !== undefined ? ` rotate(${point.angle}rad)` : ""}`;
		}
	};

	return {
		id,
		target,
		path: options,
		progress,
		points: [...getMotionPathPoints(motionPath)],
		getPointAtProgress: (p: number) => getPointAtProgress(motionPath, p),
		play: () => {
			if (!isPlaying) {
				isPlaying = true;
				startTime = null;
				animationFrameId = requestAnimationFrame(update);
			}
		},
		pause: () => {
			isPlaying = false;
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
				animationFrameId = null;
			}
		},
		cancel: () => {
			isPlaying = false;
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
				animationFrameId = null;
			}
			progress = 0;
		},
		seek: (p: number) => {
			progress = Math.max(0, Math.min(1, p));
			const point = getPointAtProgress(motionPath, progress);
			applyToTarget(target, point);
		},
	};
}
