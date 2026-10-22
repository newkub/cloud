import type {
	AnimationCallback,
	AnimationInstance,
	AnimationParameters,
	AnimationPlayState,
	AnimationTarget,
	AnimationValue,
	TimelineInstance,
	TimelineOptions,
	TimelineState,
} from "../modules/animation/types";

/**
 * Animation adapter implementation
 * Creates animation instances with browser API
 */
export function createAnimationAdapter(
	targets: AnimationTarget,
	properties: Record<string, AnimationValue>,
	parameters: AnimationParameters = {},
	callbacks: AnimationCallback = {},
	randomUUID: () => string = (randomUUID: () => string = () => crypto.randomUUID()) => randomUUID(),
): AnimationInstance {
	// Use the browser's Web Animations API
	const element = Array.isArray(targets) ? targets[0] : targets;
	if (!(element instanceof Element)) {
		throw new Error("Animation target must be an Element");
	}

	const duration = parameters.duration || 1000;
	const easing = typeof parameters.easing === "string" ? parameters.easing : "ease-in-out";

	// WAAPI property-indexed keyframes: { opacity: [0, 1], translateY: [24, 0] }
	const keyframes = properties as unknown as PropertyIndexedKeyframes;

	const animation = element.animate(keyframes, {
		duration,
		easing,
		delay: parameters.delay || 0,
		direction: parameters.direction || "normal",
		iterations: parameters.loop === true ? Infinity : typeof parameters.loop === "number" ? parameters.loop : 1,
		fill: parameters.fill || "forwards",
	});

	if (callbacks.onComplete) {
		animation.onfinish = callbacks.onComplete;
	}

	let currentState: AnimationPlayState = "idle";
	const id = parameters.id ?? randomUUID();

	return {
		id,
		target: element,
		properties,
		options: parameters,
		state: currentState,
		progress: 0,
		currentTime: 0,
		duration,
		play: () => {
			animation.play();
			currentState = "running";
		},
		pause: () => {
			animation.pause();
			currentState = "paused";
		},
		reverse: () => animation.reverse(),
		restart: () => {
			animation.cancel();
			animation.play();
			currentState = "running";
		},
		cancel: () => {
			animation.cancel();
			currentState = "idle";
		},
		seek: (time: number) => {
			animation.currentTime = time;
		},
		onComplete: (callback: () => void) => {
			animation.onfinish = callback;
		},
	};
}

const applyToAllAnimations = (
	animations: AnimationInstance[],
	method: "play" | "pause" | "reverse" | "restart" | "cancel",
): void => {
	for (const anim of animations) {
		anim[method]();
	}
};

/**
 * Timeline adapter implementation
 * Creates timeline instances for sequencing animations
 */
export function createTimelineAdapter(
	options: TimelineOptions = {},
	randomUUID: () => string = (randomUUID: () => string = () => crypto.randomUUID()) => randomUUID(),
): TimelineInstance {
	const animations: AnimationInstance[] = [];
	const labels = new Map<string, number>();
	const id = options.id ?? randomUUID();

	const currentState: TimelineState = {
		isPlaying: false,
		isPaused: false,
		progress: 0,
		currentTime: 0,
	};

	const instance: TimelineInstance = {
		id,
		animations,
		options,
		state: currentState,
		progress: 0,
		currentTime: 0,
		totalDuration: 0,
		duration: 0,
		add: (animationOrLabel: AnimationInstance | string, time?: number): TimelineInstance => {
			if (typeof animationOrLabel === "string") {
				labels.set(animationOrLabel, time || 0);
			} else {
				animations.push(animationOrLabel);
			}
			return instance;
		},
		remove: (animationId: string): TimelineInstance => {
			const index = animations.findIndex((a) => a.id === animationId);
			if (index !== -1) {
				animations.splice(index, 1);
			}
			return instance;
		},
		play: () => {
			applyToAllAnimations(animations, "play");
			currentState.isPlaying = true;
			currentState.isPaused = false;
		},
		pause: () => {
			applyToAllAnimations(animations, "pause");
			currentState.isPlaying = false;
			currentState.isPaused = true;
		},
		reverse: () => {
			applyToAllAnimations(animations, "reverse");
		},
		restart: () => {
			applyToAllAnimations(animations, "restart");
			currentState.isPlaying = true;
			currentState.isPaused = false;
		},
		cancel: () => {
			applyToAllAnimations(animations, "cancel");
			currentState.isPlaying = false;
			currentState.isPaused = false;
		},
		seek: (time: number): TimelineInstance => {
			for (const anim of animations) {
				anim.seek(time);
			}
			currentState.currentTime = time;
			return instance;
		},
		onComplete: (callback: () => void) => {
			if (animations.length > 0) {
				const lastAnimation = animations[animations.length - 1];
				if (lastAnimation?.onComplete) {
					lastAnimation.onComplete(callback);
				}
			}
		},
	};

	return instance;
}
