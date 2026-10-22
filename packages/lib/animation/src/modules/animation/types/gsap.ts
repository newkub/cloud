/**
 * GSAP Compatibility Types
 */

export interface GSAPLikeOptions {
	duration?: number;
	delay?: number;
	ease?: string;
	repeat?: number;
	yoyo?: boolean;
	onComplete?: () => void;
	onUpdate?: () => void;
}

export interface GSAPLikeTarget {
	gsapTo?: (props: Record<string, unknown>, options?: GSAPLikeOptions) => void;
	gsapFrom?: (props: Record<string, unknown>, options?: GSAPLikeOptions) => void;
	gsapFromTo?: (
		fromProps: Record<string, unknown>,
		toProps: Record<string, unknown>,
		options?: GSAPLikeOptions,
	) => void;
}
