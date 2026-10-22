/**
 * Spring Animation Domain Model
 * Handles physics-based spring animations
 */

import type { SpringOptions, SpringState } from "../../../types";

export class SpringAnimation {
	private options: SpringOptions;
	private state: SpringState;
	private animationFrameId: number | null = null;
	private startTime: number | null = null;

	constructor(options: SpringOptions = {}) {
		this.options = {
			stiffness: 100,
			damping: 10,
			mass: 1,
			velocity: 0,
			...options,
		};

		this.state = {
			currentValue: 0,
			velocity: this.options.velocity ?? 0,
			isSettled: false,
		};
	}

	public animateTo(targetValue: number): void {
		this.startTime = performance.now();
		const startValue = this.state.currentValue;
		const startVelocity = this.state.velocity;

		const animate = (timestamp: number) => {
			if (!this.startTime) return;

			const elapsed = (timestamp - this.startTime) / 1000;
			const { currentValue, velocity, isSettled } = this.calculateSpring(
				startValue,
				targetValue,
				startVelocity,
				elapsed,
			);

			this.state = { currentValue, velocity, isSettled };

			if (!isSettled) {
				this.animationFrameId = requestAnimationFrame(animate);
			}
		};

		this.animationFrameId = requestAnimationFrame(animate);
	}

	private calculateSpring(
		startValue: number,
		targetValue: number,
		_startVelocity: number,
		elapsed: number,
	): SpringState {
		const stiffness = this.options.stiffness ?? 100;
		const damping = this.options.damping ?? 10;
		const mass = this.options.mass ?? 1;

		// Simple harmonic motion with damping
		const angularFrequency = Math.sqrt(stiffness / mass);
		const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));

		let currentValue: number;
		let velocity: number;
		let isSettled = false;

		if (dampingRatio < 1) {
			// Underdamped
			const dampedFrequency = angularFrequency * Math.sqrt(1 - dampingRatio * dampingRatio);
			const envelope = Math.exp(-dampingRatio * angularFrequency * elapsed);
			const oscillation = Math.cos(dampedFrequency * elapsed);
			const decay = envelope * oscillation;

			currentValue = targetValue + (startValue - targetValue) * decay;
			velocity = (startValue - targetValue) * envelope * -dampedFrequency * Math.sin(dampedFrequency * elapsed);
		} else if (dampingRatio === 1) {
			// Critically damped
			const envelope = Math.exp(-angularFrequency * elapsed);
			currentValue = targetValue + (startValue - targetValue) * (1 + angularFrequency * elapsed) * envelope;
			velocity = (startValue - targetValue) * envelope * -angularFrequency * elapsed;
		} else {
			// Overdamped
			const r1 = -dampingRatio * angularFrequency + angularFrequency * Math.sqrt(dampingRatio * dampingRatio - 1);
			const r2 = -dampingRatio * angularFrequency - angularFrequency * Math.sqrt(dampingRatio * dampingRatio - 1);
			const c1 = (targetValue - startValue * r2) / (r1 - r2);
			const c2 = (startValue * r1 - targetValue) / (r1 - r2);
			currentValue = targetValue + c1 * Math.exp(r1 * elapsed) + c2 * Math.exp(r2 * elapsed);
			velocity = c1 * r1 * Math.exp(r1 * elapsed) + c2 * r2 * Math.exp(r2 * elapsed);
		}

		// Check if settled
		const displacement = Math.abs(currentValue - targetValue);
		const speed = Math.abs(velocity);
		isSettled = displacement < 0.01 && speed < 0.01;

		return { currentValue, velocity, isSettled };
	}

	public getState(): SpringState {
		return this.state;
	}

	public setCurrentValue(value: number): void {
		this.state = {
			...this.state,
			currentValue: value,
		};
	}

	public setVelocity(velocity: number): void {
		this.state = {
			...this.state,
			velocity,
		};
	}

	public stop(): void {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		this.startTime = null;
	}

	public dispose(): void {
		this.stop();
	}
}
