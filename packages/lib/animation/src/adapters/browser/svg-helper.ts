import type { SVGPathOptions } from "../../shared/types/svg";

/**
 * SVG Helper infrastructure - Handles SVG-specific operations (Functional style)
 */

export const setSVGDraw = (element: SVGGeometryElement, progress: number): void => {
	const length = element.getTotalLength();
	element.style.strokeDasharray = length.toString();
	element.style.strokeDashoffset = (length * (1 - progress)).toString();
};

export const createSVGDrawable = (element: SVGGeometryElement): SVGGeometryElement => {
	const length = element.getTotalLength();
	element.style.strokeDasharray = length.toString();
	element.style.strokeDashoffset = length.toString();
	return element;
};

export const createSVGMotionPath = (element: SVGElement, options: SVGPathOptions): SVGElement => {
	const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("d", options.path);
	path.setAttribute("fill", "none");
	path.setAttribute("stroke", "transparent");
	path.style.opacity = "0";

	if (options.rotate) {
		element.setAttribute("motion-rotate", "auto");
	}

	if (options.align) {
		element.setAttribute("motion-path-align", "align");
	}

	return path;
};

export const morphSVG = (element: SVGGeometryElement, toPath: string): void => {
	// For shape morphing, we would typically use a library like flubber
	// This is a simplified version that just updates the d attribute
	if (element.tagName === "path") {
		element.setAttribute("d", toPath);
	}
};

export const getSVGPathLength = (element: SVGGeometryElement): number => element.getTotalLength();

export const getSVGPointAtLength = (element: SVGGeometryElement, length: number): DOMPoint =>
	element.getPointAtLength(length);
