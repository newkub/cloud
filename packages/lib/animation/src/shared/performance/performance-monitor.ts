/**
 * Performance Monitor infrastructure - Tracks animation performance (Functional style)
 */

export type PerformanceMonitorState = Readonly<{
	metrics: Map<string, number[]>;
	frameTimes: number[];
	lastFrameTime: number;
}>;

export const INITIAL_PERFORMANCE_MONITOR_STATE: PerformanceMonitorState = {
	metrics: new Map(),
	frameTimes: [],
	lastFrameTime: performance.now(),
};

export const createPerformanceMonitor = (): PerformanceMonitorState => ({
	...INITIAL_PERFORMANCE_MONITOR_STATE,
});

export const startMeasure = (state: PerformanceMonitorState, name: string): PerformanceMonitorState => {
	performance.mark(`${name}-start`);
	return state;
};

export const endMeasure = (
	state: PerformanceMonitorState,
	name: string,
): { state: PerformanceMonitorState; duration: number } => {
	performance.mark(`${name}-end`);
	performance.measure(name, `${name}-start`, `${name}-end`);

	const measure = performance.getEntriesByName(name)[0];
	const duration = measure?.duration ?? 0;

	const metrics = state.metrics.get(name) || [];
	const newMetrics = [...metrics, duration];

	// Keep only last 100 measurements
	if (newMetrics.length > 100) {
		newMetrics.shift();
	}

	performance.clearMarks(`${name}-start`);
	performance.clearMarks(`${name}-end`);
	performance.clearMeasures(name);

	return {
		state: {
			...state,
			metrics: new Map([...state.metrics, [name, newMetrics]]),
		},
		duration,
	};
};

export const recordFrameTime = (state: PerformanceMonitorState): PerformanceMonitorState => {
	const now = performance.now();
	const delta = now - state.lastFrameTime;

	const newFrameTimes = [...state.frameTimes, delta];
	if (newFrameTimes.length > 100) {
		newFrameTimes.shift();
	}

	return {
		...state,
		frameTimes: newFrameTimes,
		lastFrameTime: now,
	};
};

export const getAverageFPS = (state: PerformanceMonitorState): number => {
	if (state.frameTimes.length === 0) {
		return 0;
	}
	const avgFrameTime = state.frameTimes.reduce((a, b) => a + b, 0) / state.frameTimes.length;
	return 1000 / avgFrameTime;
};

export const getAverageMeasure = (state: PerformanceMonitorState, name: string): number => {
	const metrics = state.metrics.get(name);
	if (!metrics || metrics.length === 0) {
		return 0;
	}
	return metrics.reduce((a, b) => a + b, 0) / metrics.length;
};

export const resetPerformanceMonitor = (): PerformanceMonitorState => ({
	...INITIAL_PERFORMANCE_MONITOR_STATE,
});

export const performanceMonitor = createPerformanceMonitor();
