/**
 * Use case: 3D Transform Animation
 * Creates and manages 3D CSS transform animations
 */

import { Transform3DModel } from "../../../domain/models/graphics/index";
import type { AnimationTarget, Transform3D, Transform3DOptions } from "../../../types/index";

export function createTransform3D(
	target: AnimationTarget,
	transforms: Transform3D,
	options: Transform3DOptions | undefined,
	id: string,
) {
	const model = new Transform3DModel(transforms, options);
	let progress = 0;
	let isPlaying = false;
	let animationFrameId: number | null = null;
	let startTime: number | null = null;
	const duration = model.getDuration();
	const delay = model.getDelay();

	const update = (timestamp: number) => {
		if (!startTime) startTime = timestamp;
		const elapsed = timestamp - startTime;

		if (elapsed < delay) {
			animationFrameId = requestAnimationFrame(update);
			return;
		}

		const adjustedElapsed = elapsed - delay;
		progress = Math.min(adjustedElapsed / duration, 1);

		applyToTarget(target, progress);

		if (progress < 1 && isPlaying) {
			animationFrameId = requestAnimationFrame(update);
		} else if (progress >= 1) {
			isPlaying = false;
		}
	};

	const applyToTarget = (target: AnimationTarget, p: number) => {
		const transformString = model.getTransformString(p);
		const perspectiveCSS = model.getPerspectiveCSS();
		const transformStyleCSS = model.getTransformStyleCSS();
		const backfaceVisibilityCSS = model.getBackfaceVisibilityCSS();

		if (typeof target === "string") {
			const element = document.querySelector(target) as HTMLElement;
			if (element) {
				element.style.transform = transformString;
				if (perspectiveCSS) {
					element.style.cssText += perspectiveCSS;
				}
				if (transformStyleCSS) {
					element.style.cssText += transformStyleCSS;
				}
				if (backfaceVisibilityCSS) {
					element.style.cssText += backfaceVisibilityCSS;
				}
			}
		} else if (target instanceof HTMLElement) {
			target.style.transform = transformString;
			if (perspectiveCSS) {
				target.style.cssText += perspectiveCSS;
			}
			if (transformStyleCSS) {
				target.style.cssText += transformStyleCSS;
			}
			if (backfaceVisibilityCSS) {
				target.style.cssText += backfaceVisibilityCSS;
			}
		}
	};

	return {
		id,
		target,
		transforms,
		progress,
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
			applyToTarget(target, progress);
		},
	};
}
