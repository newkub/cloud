/**
 * 3D Transform Domain Model
 * Handles 3D CSS transform logic
 */

import type { EasingFunction, Transform3D } from "../../../types";

export class Transform3DModel {
	public readonly transforms: Transform3D;
	private duration: number;
	private easing?: string | EasingFunction;
	private delay: number;

	constructor(
		transforms: Transform3D,
		options?: {
			duration?: number;
			easing?: string | EasingFunction;
			delay?: number;
		},
	) {
		this.transforms = transforms;
		this.duration = options?.duration ?? 1000;
		this.easing = options?.easing;
		this.delay = options?.delay ?? 0;
	}

	public getTransformString(progress: number): string {
		const adjustedProgress = this.applyEasing(progress);
		const parts: string[] = [];

		if (this.transforms.translateX !== undefined) {
			parts.push(`translateX(${this.interpolate(0, this.transforms.translateX, adjustedProgress)}px)`);
		}
		if (this.transforms.translateY !== undefined) {
			parts.push(`translateY(${this.interpolate(0, this.transforms.translateY, adjustedProgress)}px)`);
		}
		if (this.transforms.translateZ !== undefined) {
			parts.push(`translateZ(${this.interpolate(0, this.transforms.translateZ, adjustedProgress)}px)`);
		}
		if (this.transforms.rotateX !== undefined) {
			parts.push(`rotateX(${this.interpolateRotation(0, this.transforms.rotateX, adjustedProgress)})`);
		}
		if (this.transforms.rotateY !== undefined) {
			parts.push(`rotateY(${this.interpolateRotation(0, this.transforms.rotateY, adjustedProgress)})`);
		}
		if (this.transforms.rotateZ !== undefined) {
			parts.push(`rotateZ(${this.interpolateRotation(0, this.transforms.rotateZ, adjustedProgress)})`);
		}
		if (this.transforms.scaleX !== undefined) {
			parts.push(`scaleX(${this.interpolate(1, this.transforms.scaleX, adjustedProgress)})`);
		}
		if (this.transforms.scaleY !== undefined) {
			parts.push(`scaleY(${this.interpolate(1, this.transforms.scaleY, adjustedProgress)})`);
		}
		if (this.transforms.scaleZ !== undefined) {
			parts.push(`scaleZ(${this.interpolate(1, this.transforms.scaleZ, adjustedProgress)})`);
		}

		return parts.join(" ");
	}

	public getPerspectiveCSS(): string {
		if (this.transforms.perspective !== undefined) {
			return `perspective: ${this.transforms.perspective}px;`;
		}
		return "";
	}

	public getTransformStyleCSS(): string {
		if (this.transforms.transformStyle !== undefined) {
			return `transform-style: ${this.transforms.transformStyle};`;
		}
		return "";
	}

	public getBackfaceVisibilityCSS(): string {
		if (this.transforms.backfaceVisibility !== undefined) {
			return `backface-visibility: ${this.transforms.backfaceVisibility};`;
		}
		return "";
	}

	private interpolate(from: number, to: number, progress: number): number {
		return from + (to - from) * progress;
	}

	private interpolateRotation(from: number, to: number | string, progress: number): string {
		if (typeof to === "string") {
			// Handle string rotations like "1turn", "90deg"
			return to;
		}
		return `${this.interpolate(from, to, progress)}deg`;
	}

	private applyEasing(progress: number): number {
		if (!this.easing || typeof this.easing === "string") {
			return progress;
		}
		return this.easing(progress);
	}

	public getDuration(): number {
		return this.duration;
	}

	public getDelay(): number {
		return this.delay;
	}
}
