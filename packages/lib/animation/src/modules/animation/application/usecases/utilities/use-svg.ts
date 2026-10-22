import {
	createSVGDrawable as createDrawable,
	createSVGMotionPath,
	getSVGPathLength,
	getSVGPointAtLength,
	morphSVG,
	setSVGDraw,
} from "../../../../../adapters/browser/index";
import type { SVGMorphOptions } from "../../../../../shared/types/index";

/**
 * Use case: SVG operations (drawing, motion path, morphing)
 */
export function createSVGFactory() {
	return {
		createDrawable,
		setDraw: setSVGDraw,
		createMotionPath: createSVGMotionPath,
		morph: (element: SVGGeometryElement, options: SVGMorphOptions): void => {
			morphSVG(element, options.to);
		},
		getPathLength: getSVGPathLength,
		getPointAtLength: getSVGPointAtLength,
	};
}
