/**
 * Motion Capture Domain Model
 * Captures motion from mouse, touch, or webcam
 */

import type { MotionCaptureOptions, MotionData } from "../../../types";

export class MotionCapture {
	private options: MotionCaptureOptions;
	private isCapturing = false;
	private motionData: MotionData[] = [];
	private eventListeners: Array<() => void> = [];
	private smoothingFactor: number;
	private videoElement: HTMLVideoElement | null = null;
	private webcamStream: MediaStream | null = null;
	private animationFrameId: number | null = null;

	constructor(options: MotionCaptureOptions = {}) {
		this.options = {
			sensorType: "mouse",
			smoothing: 0.5,
			sensitivity: 1,
			...options,
		};
		this.smoothingFactor = this.options.smoothing ?? 0.5;
	}

	public startCapture(): void {
		if (this.isCapturing) return;

		this.isCapturing = true;
		this.motionData = [];

		if (this.options.sensorType === "mouse") {
			this.captureMouse();
		} else if (this.options.sensorType === "touch") {
			this.captureTouch();
		} else if (this.options.sensorType === "webcam") {
			this.captureWebcam();
		}
	}

	public stopCapture(): void {
		this.isCapturing = false;
		this.eventListeners.forEach((remove) => {
			remove();
		});
		this.eventListeners = [];

		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}

		if (this.webcamStream) {
			for (const track of this.webcamStream.getTracks()) {
				track.stop();
			}
			this.webcamStream = null;
		}

		if (this.videoElement) {
			this.videoElement.pause();
			this.videoElement.srcObject = null;
			this.videoElement = null;
		}
	}

	private captureMouse(): void {
		const handleMouseMove = (event: MouseEvent) => {
			if (!this.isCapturing) return;

			const data: MotionData = {
				x: event.clientX * (this.options.sensitivity ?? 1),
				y: event.clientY * (this.options.sensitivity ?? 1),
				timestamp: performance.now(),
			};

			this.addMotionData(data);
		};

		document.addEventListener("mousemove", handleMouseMove);
		this.eventListeners.push(() => {
			document.removeEventListener("mousemove", handleMouseMove);
		});
	}

	private captureTouch(): void {
		const handleTouchMove = (event: TouchEvent) => {
			if (!this.isCapturing) return;

			const touch = event.touches[0];
			if (touch) {
				const data: MotionData = {
					x: touch.clientX * (this.options.sensitivity ?? 1),
					y: touch.clientY * (this.options.sensitivity ?? 1),
					timestamp: performance.now(),
				};

				this.addMotionData(data);
			}
		};

		document.addEventListener("touchmove", handleTouchMove);
		this.eventListeners.push(() => {
			document.removeEventListener("touchmove", handleTouchMove);
		});
	}

	private captureWebcam(): void {
		// Basic webcam capture without external pose-detection libraries.
		// Full skeletal/body tracking still requires MediaPipe or similar.
		if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
			console.warn("Webcam capture is not supported in this environment");
			return;
		}

		const video = document.createElement("video");
		video.style.display = "none";
		video.playsInline = true;
		video.autoplay = true;
		this.videoElement = video;

		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				if (!this.isCapturing) {
					for (const track of stream.getTracks()) {
						track.stop();
					}
					return;
				}

				this.webcamStream = stream;
				this.videoElement = video;
				video.srcObject = stream;
				video.play().catch((error) => {
					console.warn("Failed to play webcam video:", error);
				});

				const tick = (): void => {
					if (!this.isCapturing || !video.videoWidth) {
						return;
					}

					const data: MotionData = {
						x: (video.videoWidth / 2) * (this.options.sensitivity ?? 1),
						y: (video.videoHeight / 2) * (this.options.sensitivity ?? 1),
						timestamp: performance.now(),
					};

					this.addMotionData(data);
					this.animationFrameId = requestAnimationFrame(tick);
				};

				this.animationFrameId = requestAnimationFrame(tick);
			})
			.catch((error) => {
				console.warn("Failed to access webcam:", error);
			});
	}

	private addMotionData(data: MotionData): void {
		if (this.motionData.length > 0) {
			const lastData = this.motionData[this.motionData.length - 1];
			if (lastData) {
				data.x = this.smoothValue(lastData.x, data.x);
				data.y = this.smoothValue(lastData.y, data.y);
			}
		}

		this.motionData.push(data);

		// Keep only last 1000 data points
		if (this.motionData.length > 1000) {
			this.motionData.shift();
		}
	}

	private smoothValue(previous: number, current: number): number {
		return previous + (current - previous) * this.smoothingFactor;
	}

	public getMotionData(): MotionData[] {
		return this.motionData;
	}

	public getLatestMotionData(): MotionData | null {
		if (this.motionData.length === 0) return null;
		return this.motionData[this.motionData.length - 1] ?? null;
	}

	public clearMotionData(): void {
		this.motionData = [];
	}

	public dispose(): void {
		this.stopCapture();
		this.clearMotionData();
	}
}
