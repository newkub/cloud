/**
 * 3D Transform Types
 */

export interface Transform3D {
	translateX?: number;
	translateY?: number;
	translateZ?: number;
	rotateX?: number | string;
	rotateY?: number | string;
	rotateZ?: number | string;
	scaleX?: number;
	scaleY?: number;
	scaleZ?: number;
	perspective?: number;
	transformStyle?: "flat" | "preserve-3d";
	backfaceVisibility?: "visible" | "hidden";
}

export interface Transform3DOptions {
	id?: string;
	duration?: number;
	easing?: string | import("./animation-parameters").EasingFunction;
	delay?: number;
}
