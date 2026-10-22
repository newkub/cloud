/**
 * Lottie Animation Domain Model
 * Handles Lottie JSON animations
 * Note: This is a basic implementation. For full Lottie support, integrate lottie-web library.
 */

import type { LottieInstance, LottieOptions } from "../../../types";

export class LottieAnimation {
	private options: LottieOptions;
	private isPlaying = false;
	private currentFrame = 0;
	private speed = 1;
	private direction = 1;
	private totalFrames = 0;
	private animationFrameId: number | null = null;

	constructor(options: LottieOptions) {
		this.options = {
			loop: false,
			autoplay: true,
			renderer: "svg",
			...options,
		};

		// Extract total frames from animation data if available
		if (this.options.animationData && typeof this.options.animationData === "object") {
			const data = this.options.animationData as {
				fr?: number;
				op?: number;
				ip?: number;
			};
			this.totalFrames = (data.op ?? 0) - (data.ip ?? 0);
		}

		if (this.options.autoplay) {
			this.play();
		}
	}

	public play(): void {
		if (this.isPlaying) return;
		this.isPlaying = true;
		this.animate();
	}

	public pause(): void {
		this.isPlaying = false;
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	public stop(): void {
		this.pause();
		this.currentFrame = 0;
	}

	public setSpeed(speed: number): void {
		this.speed = speed;
	}

	public setDirection(direction: number): void {
		this.direction = direction;
	}

	public goToAndPlay(frame: number): void {
		this.currentFrame = frame;
		this.play();
	}

	public goToAndStop(frame: number): void {
		this.currentFrame = frame;
		this.stop();
	}

	private animate(): void {
		if (!this.isPlaying) return;

		const startTime = performance.now();
		const startFrame = this.currentFrame;

		const frame = () => {
			if (!this.isPlaying) return;

			const elapsed = performance.now() - startTime;
			const frameDelta = (elapsed / 1000) * 30 * this.speed * this.direction; // Assume 30fps
			this.currentFrame = Math.floor(startFrame + frameDelta);

			if (this.currentFrame >= this.totalFrames) {
				if (this.options.loop) {
					this.currentFrame = 0;
				} else {
					this.pause();
					return;
				}
			} else if (this.currentFrame < 0) {
				if (this.options.loop) {
					this.currentFrame = this.totalFrames - 1;
				} else {
					this.currentFrame = 0;
					this.pause();
					return;
				}
			}

			this.animationFrameId = requestAnimationFrame(frame);
		};

		this.animationFrameId = requestAnimationFrame(frame);
	}

	public destroy(): void {
		this.stop();
	}

	public getInstance(): LottieInstance {
		return {
			play: () => this.play(),
			pause: () => this.pause(),
			stop: () => this.stop(),
			setSpeed: (speed) => this.setSpeed(speed),
			setDirection: (direction) => this.setDirection(direction),
			goToAndPlay: (frame) => this.goToAndPlay(frame),
			goToAndStop: (frame) => this.goToAndStop(frame),
			destroy: () => this.destroy(),
		};
	}
}
