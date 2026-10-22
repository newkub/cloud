/**
 * Composition Helper - Blend and compose CSS transforms
 */

/**
 * Transform values interface
 */
export interface TransformValues {
	translateX?: number;
	translateY?: number;
	translateZ?: number;
	scale?: number;
	scaleX?: number;
	scaleY?: number;
	rotate?: number;
	rotateX?: number;
	rotateY?: number;
	rotateZ?: number;
	skewX?: number;
	skewY?: number;
}

/**
 * Compose multiple transform values into a single transform string
 * @param values - Transform values to compose
 * @returns CSS transform string
 * @example
 * composeTransform({ translateX: 100, rotate: 45 })
 * // Returns: "translate3d(100px, 0px, 0px) rotate(45deg)"
 */
export function composeTransform(values: TransformValues): string {
	const transforms: string[] = [];

	if (values.translateX !== undefined || values.translateY !== undefined || values.translateZ !== undefined) {
		const x = values.translateX ?? 0;
		const y = values.translateY ?? 0;
		const z = values.translateZ ?? 0;
		transforms.push(`translate3d(${x}px, ${y}px, ${z}px)`);
	}

	if (values.scale !== undefined) {
		transforms.push(`scale(${values.scale})`);
	} else if (values.scaleX !== undefined || values.scaleY !== undefined) {
		const sx = values.scaleX ?? 1;
		const sy = values.scaleY ?? 1;
		transforms.push(`scale(${sx}, ${sy})`);
	}

	if (values.rotate !== undefined) {
		transforms.push(`rotate(${values.rotate}deg)`);
	} else if (values.rotateX !== undefined || values.rotateY !== undefined || values.rotateZ !== undefined) {
		const rx = values.rotateX ?? 0;
		const ry = values.rotateY ?? 0;
		const rz = values.rotateZ ?? 0;
		transforms.push(`rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`);
	}

	if (values.skewX !== undefined || values.skewY !== undefined) {
		const sx = values.skewX ?? 0;
		const sy = values.skewY ?? 0;
		transforms.push(`skew(${sx}deg, ${sy}deg)`);
	}

	return transforms.join(" ");
}

/**
 * Blend two transform values based on progress (0-1)
 * @param from - Starting transform values
 * @param to - Ending transform values
 * @param progress - Interpolation progress (0-1)
 * @returns Blended transform values
 * @example
 * blendTransform({ translateX: 0 }, { translateX: 100 }, 0.5)
 * // Returns: { translateX: 50 }
 */
export function blendTransform(from: TransformValues, to: TransformValues, progress: number): TransformValues {
	const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

	return {
		translateX:
			from.translateX !== undefined && to.translateX !== undefined
				? lerp(from.translateX, to.translateX, progress)
				: undefined,
		translateY:
			from.translateY !== undefined && to.translateY !== undefined
				? lerp(from.translateY, to.translateY, progress)
				: undefined,
		translateZ:
			from.translateZ !== undefined && to.translateZ !== undefined
				? lerp(from.translateZ, to.translateZ, progress)
				: undefined,
		scale: from.scale !== undefined && to.scale !== undefined ? lerp(from.scale, to.scale, progress) : undefined,
		scaleX: from.scaleX !== undefined && to.scaleX !== undefined ? lerp(from.scaleX, to.scaleX, progress) : undefined,
		scaleY: from.scaleY !== undefined && to.scaleY !== undefined ? lerp(from.scaleY, to.scaleY, progress) : undefined,
		rotate: from.rotate !== undefined && to.rotate !== undefined ? lerp(from.rotate, to.rotate, progress) : undefined,
		rotateX:
			from.rotateX !== undefined && to.rotateX !== undefined ? lerp(from.rotateX, to.rotateX, progress) : undefined,
		rotateY:
			from.rotateY !== undefined && to.rotateY !== undefined ? lerp(from.rotateY, to.rotateY, progress) : undefined,
		rotateZ:
			from.rotateZ !== undefined && to.rotateZ !== undefined ? lerp(from.rotateZ, to.rotateZ, progress) : undefined,
		skewX: from.skewX !== undefined && to.skewX !== undefined ? lerp(from.skewX, to.skewX, progress) : undefined,
		skewY: from.skewY !== undefined && to.skewY !== undefined ? lerp(from.skewY, to.skewY, progress) : undefined,
	};
}

/**
 * Parse a transform string into TransformValues
 * @param transform - CSS transform string to parse
 * @returns Parsed transform values
 * @example
 * parseTransform("translate3d(100px, 0px, 0px) rotate(45deg)")
 * // Returns: { translateX: 100, translateY: 0, translateZ: 0, rotate: 45 }
 */
export function parseTransform(transform: string): TransformValues {
	const values: TransformValues = {};

	// Match translate3d
	const translateMatch = transform.match(/translate3d\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
	if (translateMatch) {
		values.translateX = parseFloat(translateMatch[1] ?? "0");
		values.translateY = parseFloat(translateMatch[2] ?? "0");
		values.translateZ = parseFloat(translateMatch[3] ?? "0");
	}

	// Match scale
	const scaleMatch = transform.match(/scale\(([^)]+)\)/);
	if (scaleMatch) {
		const scaleValue = scaleMatch[1]?.split(",").map((v) => parseFloat(v.trim())) ?? [];
		if (scaleValue.length === 1) {
			values.scale = scaleValue[0];
		} else if (scaleValue.length === 2) {
			values.scaleX = scaleValue[0];
			values.scaleY = scaleValue[1];
		}
	}

	// Match rotate
	const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
	if (rotateMatch) {
		values.rotate = parseFloat(rotateMatch[1] ?? "0");
	}

	return values;
}
