/**
 * Performance Profiling Types
 */

export interface AnimationPerformanceMetrics {
	fps: number;
	frameTime: number;
	memoryUsage: number;
	totalAnimations: number;
	activeAnimations: number;
}

export interface PerformanceProfile {
	timestamp: number;
	metrics: AnimationPerformanceMetrics;
	bottlenecks: string[];
}
