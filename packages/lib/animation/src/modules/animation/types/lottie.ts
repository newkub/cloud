/**
 * Lottie Support Types
 */

export interface LottieOptions {
	animationData: unknown;
	loop?: boolean;
	autoplay?: boolean;
	renderer?: "svg" | "canvas";
}

export interface LottieInstance {
	play: () => void;
	pause: () => void;
	stop: () => void;
	setSpeed: (speed: number) => void;
	setDirection: (direction: number) => void;
	goToAndPlay: (frame: number) => void;
	goToAndStop: (frame: number) => void;
	destroy: () => void;
}
