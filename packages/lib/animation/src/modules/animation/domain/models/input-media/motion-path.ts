/**
 * Motion Path Domain Model
 * Handles path-based animation logic
 * Refactored to use pure functions and immutable data structures
 */

import type { EasingFunction, MotionPathOptions, MotionPathPoint } from "../../../types";

export interface MotionPathState {
	readonly path: string | SVGPathElement;
	readonly offset: number;
	readonly rotate: boolean | "auto" | "reverse";
	readonly align: "start" | "center" | "end";
	readonly easing?: string | EasingFunction;
	readonly points: readonly MotionPathPoint[];
	readonly totalLength: number;
}

export interface MotionPath {
	readonly state: MotionPathState;
}

/**
 * Create a new motion path
 */
export const createMotionPath = (options: MotionPathOptions): MotionPath => {
	const points = initializePathPoints(options.path);
	const totalLength = calculateTotalLength(points);

	return {
		state: {
			path: options.path,
			offset: options.offset ?? 0,
			rotate: options.rotate ?? false,
			align: options.align ?? "start",
			easing: options.easing,
			points,
			totalLength,
		},
	};
};

/**
 * Initialize path points from path string or SVG element
 */
const initializePathPoints = (path: string | SVGPathElement): MotionPathPoint[] => {
	if (typeof path === "string") {
		return parsePathString(path);
	}
	return getPathPoints(path);
};

/**
 * Parse SVG path string to points
 */
export const parsePathString = (pathString: string): MotionPathPoint[] => {
	const points: MotionPathPoint[] = [];
	const commands = pathString.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || [];

	let x = 0;
	let y = 0;

	for (const command of commands) {
		const type = command[0];
		const args = command
			.slice(1)
			.trim()
			.split(/[\s,]+/)
			.map(Number);

		switch (type) {
			case "M":
			case "m":
				x = args[0] ?? 0;
				y = args[1] ?? 0;
				points.push({ x, y });
				break;
			case "L":
			case "l":
				x += args[0] ?? 0;
				y += args[1] ?? 0;
				points.push({ x, y });
				break;
			case "H":
			case "h":
				x += args[0] ?? 0;
				points.push({ x, y });
				break;
			case "V":
			case "v":
				y += args[0] ?? 0;
				points.push({ x, y });
				break;
		}
	}

	return points;
};

/**
 * Get points from SVG path element
 */
export const getPathPoints = (pathElement: SVGPathElement): MotionPathPoint[] => {
	const points: MotionPathPoint[] = [];
	const length = pathElement.getTotalLength();
	const segments = 100;

	for (let i = 0; i <= segments; i++) {
		const point = pathElement.getPointAtLength((i / segments) * length);
		points.push({ x: point.x, y: point.y });
	}

	return points;
};

/**
 * Calculate total length of path
 */
export const calculateTotalLength = (points: readonly MotionPathPoint[]): number => {
	if (points.length < 2) return 0;

	let total = 0;
	for (let i = 1; i < points.length; i++) {
		const current = points[i] ?? { x: 0, y: 0 };
		const previous = points[i - 1] ?? { x: 0, y: 0 };
		const dx = current.x - previous.x;
		const dy = current.y - previous.y;
		total += Math.sqrt(dx * dx + dy * dy);
	}

	return total;
};

/**
 * Get point at progress along path
 */
export const getPointAtProgress = (motionPath: MotionPath, progress: number): MotionPathPoint => {
	const clampedProgress = Math.max(0, Math.min(1, progress));
	const adjustedProgress = applyEasing(motionPath.state.easing, clampedProgress);

	if (motionPath.state.points.length === 0) {
		return { x: 0, y: 0 };
	}

	const index = Math.floor(adjustedProgress * (motionPath.state.points.length - 1));
	const nextIndex = Math.min(index + 1, motionPath.state.points.length - 1);
	const segmentProgress = adjustedProgress * (motionPath.state.points.length - 1) - index;

	const currentPoint = motionPath.state.points[index] ?? { x: 0, y: 0 };
	const nextPoint = motionPath.state.points[nextIndex] ?? { x: 0, y: 0 };

	const x = currentPoint.x + (nextPoint.x - currentPoint.x) * segmentProgress;
	const y = currentPoint.y + (nextPoint.y - currentPoint.y) * segmentProgress;

	let angle: number | undefined;
	if (motionPath.state.rotate) {
		angle = calculateAngle(currentPoint, nextPoint);
		if (motionPath.state.rotate === "reverse") {
			angle += Math.PI;
		}
	}

	return { x, y, angle };
};

/**
 * Calculate angle between two points
 */
export const calculateAngle = (from: MotionPathPoint, to: MotionPathPoint): number => {
	return Math.atan2(to.y - from.y, to.x - from.x);
};

/**
 * Apply easing to progress
 */
export const applyEasing = (easing: string | EasingFunction | undefined, progress: number): number => {
	if (!easing || typeof easing === "string") {
		return progress;
	}
	return easing(progress);
};

/**
 * Get points from motion path
 */
export const getMotionPathPoints = (motionPath: MotionPath): readonly MotionPathPoint[] => motionPath.state.points;

/**
 * Get total length from motion path
 */
export const getMotionPathTotalLength = (motionPath: MotionPath): number => motionPath.state.totalLength;
