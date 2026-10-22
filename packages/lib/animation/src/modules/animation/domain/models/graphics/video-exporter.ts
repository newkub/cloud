/**
 * Video Exporter Domain Model
 * Handles canvas recording and video export
 */

import type { VideoExportOptions, VideoExportProgress } from "../../../types";

export class VideoExporter {
	private options: VideoExportOptions;
	private mediaRecorder: MediaRecorder | null = null;
	private chunks: Blob[] = [];
	private isRecording = false;
	private onProgressCallback: ((progress: VideoExportProgress) => void) | null = null;

	constructor(options: VideoExportOptions) {
		this.options = {
			fps: 30,
			duration: 5000,
			quality: 0.9,
			mimeType: "video/webm",
			...options,
		};
	}

	public startRecording(onProgress?: (progress: VideoExportProgress) => void): void {
		if (this.isRecording) return;

		this.onProgressCallback = onProgress ?? null;
		this.chunks = [];

		const stream = this.options.canvas.captureStream(this.options.fps ?? 30);
		this.mediaRecorder = new MediaRecorder(stream, {
			mimeType: this.options.mimeType ?? "video/webm",
			videoBitsPerSecond: 5000000,
		});

		this.mediaRecorder.ondataavailable = (event) => {
			if (event.data.size > 0) {
				this.chunks.push(event.data);
			}
		};

		this.mediaRecorder.onstop = () => {
			this.isRecording = false;
			if (this.onProgressCallback) {
				this.onProgressCallback({
					progress: 100,
					bytesWritten: this.chunks.reduce((acc, chunk) => acc + chunk.size, 0),
					isComplete: true,
				});
			}
		};

		this.mediaRecorder.start(100); // Collect data every 100ms
		this.isRecording = true;

		// Auto-stop after duration
		setTimeout(() => {
			this.stopRecording();
		}, this.options.duration ?? 5000);
	}

	public stopRecording(): void {
		if (!this.isRecording || !this.mediaRecorder) return;

		this.mediaRecorder.stop();
	}

	public async export(): Promise<Blob> {
		const blob = new Blob(this.chunks, {
			type: this.options.mimeType ?? "video/webm",
		});
		return blob;
	}

	public download(filename: string = "animation.webm"): void {
		this.export().then((blob) => {
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		});
	}

	public getProgress(): VideoExportProgress {
		const bytesWritten = this.chunks.reduce((acc, chunk) => acc + chunk.size, 0);
		const duration = this.options.duration ?? 5000;
		const elapsed = this.isRecording ? performance.now() % duration : duration;
		const progress = Math.min((elapsed / duration) * 100, 100);

		return {
			progress,
			bytesWritten,
			isComplete: !this.isRecording,
		};
	}

	public dispose(): void {
		if (this.mediaRecorder && this.isRecording) {
			this.mediaRecorder.stop();
		}
		this.chunks = [];
		this.isRecording = false;
	}
}
