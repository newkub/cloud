/**
 * Motion Path Animation Types
 */

export interface MotionPathOptions {
	id?: string;
	path: string | SVGPathElement;
	offset?: number;
	rotate?: boolean | "auto" | "reverse";
	align?: "start" | "center" | "end";
	easing?: string | import("./animation-parameters").EasingFunction;
}

export interface MotionPathPoint {
	x: number;
	y: number;
	angle?: number;
}

export interface MotionPathInstance {
	id: string;
	target: import("./animation-instance").AnimationTarget;
	path: MotionPathOptions;
	progress: number;
	points: MotionPathPoint[];
	getPointAtProgress(progress: number): MotionPathPoint;
	play(): void;
	pause(): void;
	cancel(): void;
	seek(progress: number): void;
}
