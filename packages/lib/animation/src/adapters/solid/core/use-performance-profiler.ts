/**
 * SolidJS composable for Performance Profiling
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createPerformanceProfiler } from "../../../modules/animation/application/usecases/core";
import type { AnimationPerformanceMetrics, PerformanceProfile } from "../../../modules/animation/types";

export function usePerformanceProfiler() {
	const [profiler, setProfiler] = createSignal<ReturnType<typeof createPerformanceProfiler> | null>(null);
	const [isMonitoring, setIsMonitoring] = createSignal(false);
	const [metrics, setMetrics] = createSignal<AnimationPerformanceMetrics>({
		fps: 0,
		frameTime: 0,
		memoryUsage: 0,
		totalAnimations: 0,
		activeAnimations: 0,
	});
	const [profiles, setProfiles] = createSignal<PerformanceProfile[]>([]);

	const createProfilerInstance = () => {
		const p = createPerformanceProfiler();
		setProfiler(p);
		return p;
	};

	const startMonitoring = () => {
		const p = profiler() || createProfilerInstance();
		p.startMonitoring();
		setIsMonitoring(true);
	};

	const stopMonitoring = () => {
		const p = profiler();
		if (p) {
			p.stopMonitoring();
			setIsMonitoring(false);
		}
	};

	const registerAnimation = () => {
		const p = profiler();
		if (p) {
			p.registerAnimation();
			updateMetrics();
		}
	};

	const unregisterAnimation = () => {
		const p = profiler();
		if (p) {
			p.unregisterAnimation();
			updateMetrics();
		}
	};

	const updateMetrics = () => {
		const p = profiler();
		if (p) {
			setMetrics(p.getCurrentMetrics());
			setProfiles(p.getProfiles());
		}
	};

	const reset = () => {
		const p = profiler();
		if (p) {
			p.reset();
			setMetrics(p.getCurrentMetrics());
			setProfiles([]);
		}
	};

	// Auto-update metrics periodically
	createEffect(() => {
		const interval = setInterval(() => {
			if (isMonitoring()) {
				updateMetrics();
			}
		}, 1000);

		onCleanup(() => {
			clearInterval(interval);
			const p = profiler();
			if (p) {
				p.stopMonitoring();
			}
		});
	});

	return {
		startMonitoring,
		stopMonitoring,
		registerAnimation,
		unregisterAnimation,
		reset,
		metrics,
		profiles,
		isMonitoring,
		profiler,
	};
}
