/**
 * Easing functions for animations
 * Clean Architecture: Infrastructure layer - Easing functions
 */

export type EasingFunction = (t: number) => number;

export const easings: Record<string, EasingFunction> = {
	linear: (t) => t,
	easeInQuad: (t) => t * t,
	easeOutQuad: (t) => t * (2 - t),
	easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
	easeInCubic: (t) => t * t * t,
	easeOutCubic: (t) => --t * t * t + 1,
	easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
	easeInElastic: (t) => {
		const c4 = (2 * Math.PI) / 3;
		return t === 0 ? 0 : t === 1 ? 1 : -(2 ** (10 * t - 10)) * Math.sin((t * 10 - 10.75) * c4);
	},
	easeOutElastic: (t) => {
		const c4 = (2 * Math.PI) / 3;
		return t === 0 ? 0 : t === 1 ? 1 : 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
	},
	easeInOutElastic: (t) => {
		const c5 = (2 * Math.PI) / 4.5;
		return t === 0
			? 0
			: t === 1
				? 1
				: t < 0.5
					? -(2 ** (20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
					: (2 ** (-20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
	},
	easeInBounce: (t) => {
		const n1 = 7.5625;
		const d1 = 2.75;
		if (t < 1 / d1) {
			return n1 * t * t;
		} else if (t < 2 / d1) {
			t -= 1.5 / d1;
			return n1 * t * t + 0.75;
		} else if (t < 2.5 / d1) {
			t -= 2.25 / d1;
			return n1 * t * t + 0.9375;
		} else {
			t -= 2.625 / d1;
			return n1 * t * t + 0.984375;
		}
	},
	easeOutBounce: (t) => {
		const n1 = 7.5625;
		const d1 = 2.75;
		if (t < 1 / d1) {
			return n1 * t * t;
		} else if (t < 2 / d1) {
			t -= 1.5 / d1;
			return n1 * t * t + 0.75;
		} else if (t < 2.5 / d1) {
			t -= 2.25 / d1;
			return n1 * t * t + 0.9375;
		} else {
			t -= 2.625 / d1;
			return n1 * t * t + 0.984375;
		}
	},
	easeInOutBounce: (t) => {
		const n1 = 7.5625;
		const d1 = 2.75;
		if (t < 0.5) {
			const tScaled = t * 2;
			if (tScaled < 1 / d1) {
				return n1 * tScaled * tScaled;
			} else if (tScaled < 2 / d1) {
				const tAdjusted = tScaled - 1.5 / d1;
				return n1 * tAdjusted * tAdjusted + 0.75;
			} else if (tScaled < 2.5 / d1) {
				const tAdjusted = tScaled - 2.25 / d1;
				return n1 * tAdjusted * tAdjusted + 0.9375;
			} else {
				const tAdjusted = tScaled - 2.625 / d1;
				return n1 * tAdjusted * tAdjusted + 0.984375;
			}
		} else {
			const tScaled = t * 2 - 1;
			if (tScaled < 1 / d1) {
				return n1 * tScaled * tScaled;
			} else if (tScaled < 2 / d1) {
				const tAdjusted = tScaled - 1.5 / d1;
				return n1 * tAdjusted * tAdjusted + 0.75;
			} else if (tScaled < 2.5 / d1) {
				const tAdjusted = tScaled - 2.25 / d1;
				return n1 * tAdjusted * tAdjusted + 0.9375;
			} else {
				const tAdjusted = tScaled - 2.625 / d1;
				return n1 * tAdjusted * tAdjusted + 0.984375;
			}
		}
	},
};
