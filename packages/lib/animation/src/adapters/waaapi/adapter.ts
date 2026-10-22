/**
 * WAAPI Adapter - Web Animation API integration
 */

import type {
	AnimationOptions,
	AnimationProperties,
	AnimationTarget,
	EasingFunction,
} from "../../modules/animation/types";

export interface WAAPIOptions {
	duration?: number;
	delay?: number;
	easing?: EasingFunction;
	direction?: AnimationOptions["direction"];
	iterations?: number;
	fill?: AnimationOptions["fill"];
}

export class WAAPIAdapter {
	animate(target: AnimationTarget, properties: AnimationProperties, options: WAAPIOptions = {}): Animation | null {
		if (typeof target === "string") {
			const element = document.querySelector(target);
			if (!element) return null;
			return this._animateElement(element, properties, options);
		}

		if (target instanceof Element) {
			return this._animateElement(target, properties, options);
		}

		if (typeof target === "object") {
			return this._animateObject(target, properties, options);
		}

		return null;
	}

	private _animateElement(element: Element, properties: AnimationProperties, options: WAAPIOptions): Animation | null {
		const keyframes = this._propertiesToKeyframes(properties);
		const animOptions = this._toWAAPIOptions(options);

		try {
			return element.animate(keyframes, animOptions);
		} catch {
			return null;
		}
	}

	private _animateObject(obj: object, properties: AnimationProperties, options: WAAPIOptions): Animation | null {
		const duration = options.duration || 1000;
		const easing = options.easing || ((t) => t);
		const startTime = performance.now();

		const animate = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = easing(progress);

			for (const [key, value] of Object.entries(properties)) {
				if (typeof value === "number") {
					(obj as Record<string, unknown>)[key] = value * eased;
				}
			}

			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
		return null;
	}

	private _propertiesToKeyframes(properties: AnimationProperties): Keyframe[] {
		const from: Keyframe = {};
		const to: Keyframe = {};

		for (const [key, value] of Object.entries(properties)) {
			to[key as keyof Keyframe] = value as Keyframe[keyof Keyframe];
		}

		return [from, to];
	}

	private _toWAAPIOptions(options: WAAPIOptions): KeyframeAnimationOptions {
		return {
			duration: options.duration || 1000,
			delay: options.delay || 0,
			easing: options.easing ? "linear" : "ease",
			direction: options.direction || "normal",
			iterations: options.iterations || 1,
			fill: options.fill || "forwards",
		};
	}
}
