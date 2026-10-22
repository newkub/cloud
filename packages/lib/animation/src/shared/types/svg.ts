/**
 * SVG types
 */

export interface SVGDrawOptions {
	direction?: "normal" | "reverse";
	duration?: number;
	easing?: string;
}

export interface SVGPathOptions {
	align?: boolean;
	path: string;
	rotate?: boolean;
}

export interface SVGMorphOptions {
	duration?: number;
	easing?: string;
	to: string;
}
