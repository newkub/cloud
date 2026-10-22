/**
 * Animation Chaining Types
 */

export interface ChainInstance {
	to: (props: Record<string, unknown>, options?: import("./animation-parameters").AnimationParameters) => ChainInstance;
	from: (
		props: Record<string, unknown>,
		options?: import("./animation-parameters").AnimationParameters,
	) => ChainInstance;
	fromTo: (
		fromProps: Record<string, unknown>,
		toProps: Record<string, unknown>,
		options?: import("./animation-parameters").AnimationParameters,
	) => ChainInstance;
	play: () => void;
	pause: () => void;
	reverse: () => void;
	restart: () => void;
	cancel: () => void;
}
