/**
 * Use case: GSAP Compatibility
 * Provides GSAP-like API for migration from GSAP ecosystem
 */

import type { AnimationParameters, AnimationTarget } from "../../../types/index";

export interface GSAPTimeline {
	to: (target: AnimationTarget, props: Record<string, unknown>, options?: AnimationParameters) => GSAPTimeline;
	from: (target: AnimationTarget, props: Record<string, unknown>, options?: AnimationParameters) => GSAPTimeline;
	fromTo: (
		target: AnimationTarget,
		fromProps: Record<string, unknown>,
		toProps: Record<string, unknown>,
		options?: AnimationParameters,
	) => GSAPTimeline;
	play: () => void;
	pause: () => void;
	reverse: () => void;
	restart: () => void;
	kill: () => void;
}

export function gsapTo(
	target: AnimationTarget,
	props: Record<string, unknown>,
	options?: AnimationParameters & { onComplete?: () => void },
) {
	const element = typeof target === "string" ? (document.querySelector(target) as HTMLElement) : target;
	if (!element || !(element instanceof HTMLElement)) return { kill: () => {} };

	const duration = options?.duration ?? 1000;
	const startTime = performance.now();
	let animationFrameId: number | null = null;
	let isPlaying = true;

	const animate = (currentTime: number) => {
		if (!isPlaying) return;

		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);

		for (const key in props) {
			const value = props[key];
			if (typeof value === "number") {
				applyStyle(element, key, value * progress);
			}
		}

		if (progress < 1 && isPlaying) {
			animationFrameId = requestAnimationFrame(animate);
		} else {
			isPlaying = false;
			if (options?.onComplete) {
				options.onComplete();
			}
		}
	};

	animationFrameId = requestAnimationFrame(animate);

	return {
		kill: () => {
			isPlaying = false;
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		},
	};
}

export function gsapTimeline(): GSAPTimeline {
	const animations: Array<ReturnType<typeof gsapTo>> = [];
	return {
		to: (target: AnimationTarget, props: Record<string, unknown>, options?: AnimationParameters) => {
			const anim = gsapTo(target, props, options);
			animations.push(anim);
			return gsapTimeline();
		},
		from: (target: AnimationTarget, props: Record<string, unknown>, options?: AnimationParameters) => {
			// For simplicity, from is treated as to with starting from 0
			const anim = gsapTo(target, props, options);
			animations.push(anim);
			return gsapTimeline();
		},
		fromTo: (
			target: AnimationTarget,
			_fromProps: Record<string, unknown>,
			toProps: Record<string, unknown>,
			options?: AnimationParameters,
		) => {
			const anim = gsapTo(target, toProps, options);
			animations.push(anim);
			return gsapTimeline();
		},
		play: () => {},
		pause: () => {},
		reverse: () => {
			// Simple reverse - kill and restart
			animations.forEach((anim) => {
				anim.kill();
			});
		},
		restart: () => {
			animations.forEach((anim) => {
				anim.kill();
			});
		},
		kill: () => {
			animations.forEach((anim) => {
				anim.kill();
			});
		},
	};
}

function applyStyle(element: HTMLElement, key: string, value: number): void {
	switch (key) {
		case "x":
		case "translateX":
			element.style.transform = `translateX(${value}px)`;
			break;
		case "y":
		case "translateY":
			element.style.transform = `translateY(${value}px)`;
			break;
		case "opacity":
			element.style.opacity = value.toString();
			break;
		case "scale":
			element.style.transform = `scale(${value})`;
			break;
		case "rotate":
			element.style.transform = `rotate(${value}deg)`;
			break;
		default:
			if (key in element.style) {
				(element.style as unknown as Record<string, string>)[key] = value.toString();
			}
	}
}
