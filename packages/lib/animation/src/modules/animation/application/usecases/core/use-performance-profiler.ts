/**
 * Use case: Performance Profiling
 * Creates and manages performance monitoring
 */

import { PerformanceProfiler } from "../../../domain/models/core";
import type { AnimationPerformanceMetrics, PerformanceProfile } from "../../../types";

export function createPerformanceProfiler() {
	const profiler = new PerformanceProfiler();

	return {
		startMonitoring: () => {
			profiler.startMonitoring();
		},
		stopMonitoring: () => {
			profiler.stopMonitoring();
		},
		registerAnimation: () => {
			profiler.registerAnimation();
		},
		unregisterAnimation: () => {
			profiler.unregisterAnimation();
		},
		getCurrentMetrics: (): AnimationPerformanceMetrics => {
			return profiler.getCurrentMetrics();
		},
		getProfiles: (): PerformanceProfile[] => {
			return profiler.getProfiles();
		},
		getAverageFPS: (): number => {
			return profiler.getAverageFPS();
		},
		getAverageFrameTime: (): number => {
			return profiler.getAverageFrameTime();
		},
		reset: () => {
			profiler.reset();
		},
	};
}
