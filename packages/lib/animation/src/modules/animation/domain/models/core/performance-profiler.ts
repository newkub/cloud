/**
 * Performance Profiler Domain Model
 * Monitors animation performance metrics
 */

import type { AnimationPerformanceMetrics, PerformanceProfile } from "../../../types";

export class PerformanceProfiler {
	private profiles: PerformanceProfile[] = [];
	private frameCount = 0;
	private lastFrameTime = performance.now();
	private fps = 0;
	private frameTime = 0;
	private totalAnimations = 0;
	private activeAnimations = 0;
	private isMonitoring = false;
	private animationFrameId: number | null = null;

	constructor() {
		this.totalAnimations = 0;
		this.activeAnimations = 0;
	}

	public startMonitoring(): void {
		if (this.isMonitoring) return;
		this.isMonitoring = true;
		this.lastFrameTime = performance.now();
		this.monitor();
	}

	public stopMonitoring(): void {
		this.isMonitoring = false;
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	private monitor(): void {
		if (!this.isMonitoring) return;

		const currentTime = performance.now();
		const deltaTime = currentTime - this.lastFrameTime;
		this.lastFrameTime = currentTime;

		this.frameCount++;
		this.frameTime = deltaTime;

		// Calculate FPS every second
		if (this.frameCount >= 60) {
			this.fps = Math.round((this.frameCount / deltaTime) * 1000);
			this.frameCount = 0;
		}

		// Get memory usage if available
		const memoryUsage = this.getMemoryUsage();

		const metrics: AnimationPerformanceMetrics = {
			fps: this.fps,
			frameTime: this.frameTime,
			memoryUsage,
			totalAnimations: this.totalAnimations,
			activeAnimations: this.activeAnimations,
		};

		const bottlenecks = this.detectBottlenecks(metrics);

		this.profiles.push({
			timestamp: currentTime,
			metrics,
			bottlenecks,
		});

		// Keep only last 100 profiles
		if (this.profiles.length > 100) {
			this.profiles.shift();
		}

		this.animationFrameId = requestAnimationFrame(() => this.monitor());
	}

	private getMemoryUsage(): number {
		interface PerformanceMemory {
			memory?: { usedJSHeapSize: number };
		}
		const perf = performance as PerformanceMemory;
		return perf.memory ? perf.memory.usedJSHeapSize / 1048576 : 0; // Convert to MB
	}

	private detectBottlenecks(metrics: AnimationPerformanceMetrics): string[] {
		const bottlenecks: string[] = [];

		if (metrics.fps < 30) {
			bottlenecks.push("Low FPS");
		}

		if (metrics.frameTime > 16.67) {
			bottlenecks.push("High Frame Time");
		}

		if (metrics.memoryUsage > 100) {
			bottlenecks.push("High Memory Usage");
		}

		if (metrics.activeAnimations > 50) {
			bottlenecks.push("Too Many Active Animations");
		}

		return bottlenecks;
	}

	public registerAnimation(): void {
		this.totalAnimations++;
		this.activeAnimations++;
	}

	public unregisterAnimation(): void {
		this.activeAnimations = Math.max(0, this.activeAnimations - 1);
	}

	public getCurrentMetrics(): AnimationPerformanceMetrics {
		const memoryUsage = this.getMemoryUsage();
		return {
			fps: this.fps,
			frameTime: this.frameTime,
			memoryUsage,
			totalAnimations: this.totalAnimations,
			activeAnimations: this.activeAnimations,
		};
	}

	public getProfiles(): PerformanceProfile[] {
		return this.profiles;
	}

	public getAverageFPS(): number {
		if (this.profiles.length === 0) return 0;
		const sum = this.profiles.reduce((acc, profile) => acc + profile.metrics.fps, 0);
		return Math.round(sum / this.profiles.length);
	}

	public getAverageFrameTime(): number {
		if (this.profiles.length === 0) return 0;
		const sum = this.profiles.reduce((acc, profile) => acc + profile.metrics.frameTime, 0);
		return sum / this.profiles.length;
	}

	public reset(): void {
		this.profiles = [];
		this.frameCount = 0;
		this.fps = 0;
		this.frameTime = 0;
		this.totalAnimations = 0;
		this.activeAnimations = 0;
	}
}
