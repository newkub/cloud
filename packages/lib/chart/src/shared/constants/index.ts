// Constants for chart rendering and calculations

export const CHART_CONSTANTS = {
	// Rendering constants
	DEFAULT_WIDTH: 800,
	DEFAULT_HEIGHT: 600,
	DEFAULT_PADDING: 40,
	DEFAULT_LINE_WIDTH: 2,
	DEFAULT_POINT_RADIUS: 4,

	// Animation constants
	DEFAULT_ANIMATION_DURATION: 300,
	DEFAULT_EASING: "easeInOutCubic" as const,

	// Color constants
	DEFAULT_COLORS: [
		"#3b82f6", // blue
		"#ef4444", // red
		"#10b981", // green
		"#f59e0b", // yellow
		"#8b5cf6", // purple
		"#ec4899", // pink
		"#06b6d4", // cyan
		"#f97316", // orange
	] as const,

	// Gauge constants
	GAUGE_START_ANGLE: -Math.PI,
	GAUGE_END_ANGLE: Math.PI,
	GAUGE_DEFAULT_MIN: 0,
	GAUGE_DEFAULT_MAX: 100,

	// Chart type constants
	CHART_TYPES: {
		LINE: "line" as const,
		BAR: "bar" as const,
		PIE: "pie" as const,
		GAUGE: "gauge" as const,
		GEOGRAPHIC: "geographic" as const,
	},

	// Renderer constants
	RENDERERS: {
		CANVAS: "canvas" as const,
		SVG: "svg" as const,
	},
} as const;

export const MATH_CONSTANTS = {
	PI: Math.PI,
	TWO_PI: Math.PI * 2,
	HALF_PI: Math.PI / 2,
	SQRT_2: Math.SQRT2,
	GOLDEN_RATIO: 1.618033988749895,
} as const;

export const VALIDATION_CONSTANTS = {
	MAX_DATASETS: 10,
	MAX_DATA_POINTS: 1000,
	MIN_LABEL_LENGTH: 1,
	MAX_LABEL_LENGTH: 100,
} as const;

export * from "./theme";
