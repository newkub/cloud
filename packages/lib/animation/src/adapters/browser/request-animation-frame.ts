/**
 * RequestAnimationFrame infrastructure - Handles requestAnimationFrame optimization
 */

export class RequestAnimationFrameManager {
	private callbacks: Set<FrameRequestCallback>;
	private animationFrameId: number | null;
	private isRunning: boolean;

	constructor() {
		this.callbacks = new Set();
		this.animationFrameId = null;
		this.isRunning = false;
	}

	register(callback: FrameRequestCallback): void {
		this.callbacks.add(callback);

		if (!this.isRunning) {
			this.start();
		}
	}

	unregister(callback: FrameRequestCallback): void {
		this.callbacks.delete(callback);

		if (this.callbacks.size === 0) {
			this.stop();
		}
	}

	private start(): void {
		if (this.isRunning) {
			return;
		}

		this.isRunning = true;

		const tick = (): void => {
			if (!this.isRunning) {
				return;
			}

			const callbacks = Array.from(this.callbacks);
			for (const callback of callbacks) {
				callback(performance.now());
			}

			this.animationFrameId = requestAnimationFrame(tick);
		};

		this.animationFrameId = requestAnimationFrame(tick);
	}

	private stop(): void {
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		this.isRunning = false;
	}

	getState(): Readonly<{
		callbacks: Set<FrameRequestCallback>;
		animationFrameId: number | null;
		isRunning: boolean;
	}> {
		return {
			callbacks: this.callbacks,
			animationFrameId: this.animationFrameId,
			isRunning: this.isRunning,
		};
	}
}

export const requestAnimationFrameManager = new RequestAnimationFrameManager();
