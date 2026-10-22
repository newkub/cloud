/**
 * Performance Monitor port
 * Interface for monitoring animation performance
 */

import type { Result } from "../../../shared/types";

export interface PerformanceMetrics {
	readonly fps: number;
	readonly frameTime: number;
	readonly memoryUsage: number;
	readonly animationDuration: number;
}

export interface IPerformanceMonitor {
	/**
	 * Start monitoring performance
	 */
	start(): Promise<Result<void>>;

	/**
	 * Stop monitoring and return metrics
	 */
	stop(): Promise<Result<PerformanceMetrics>>;

	/**
	 * Get current metrics without stopping
	 */
	getCurrentMetrics(): Promise<Result<PerformanceMetrics>>;

	/**
	 * Check if performance monitoring is supported
	 */
	isSupported(): boolean;
}
