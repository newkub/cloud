/**
 * Timeline Editor Domain Model
 * Manages timeline tracks and keyframes
 */

import type { Keyframe, TimelineEditorOptions, TimelineTrack } from "../../../types";

export class TimelineEditor {
	private options: TimelineEditorOptions;
	private tracks: TimelineTrack[] = [];
	private currentTime = 0;
	private duration = 0;
	private isPlaying = false;
	private animationFrameId: number | null = null;

	constructor(options: TimelineEditorOptions = {}) {
		this.options = {
			showTimeline: true,
			showControls: true,
			allowDrag: true,
			allowResize: true,
			...options,
		};
	}

	public getOptions(): TimelineEditorOptions {
		return this.options;
	}

	public addTrack(track: TimelineTrack): void {
		this.tracks.push(track);
		this.updateDuration();
	}

	public removeTrack(trackId: string): void {
		this.tracks = this.tracks.filter((t) => t.id !== trackId);
		this.updateDuration();
	}

	public addKeyframe(trackId: string, keyframe: Keyframe): void {
		const track = this.tracks.find((t) => t.id === trackId);
		if (track) {
			track.keyframes.push(keyframe);
			track.keyframes.sort((a, b) => a.time - b.time);
			this.updateDuration();
		}
	}

	public removeKeyframe(trackId: string, keyframeIndex: number): void {
		const track = this.tracks.find((t) => t.id === trackId);
		if (track && keyframeIndex >= 0 && keyframeIndex < track.keyframes.length) {
			track.keyframes.splice(keyframeIndex, 1);
			this.updateDuration();
		}
	}

	public updateKeyframe(trackId: string, keyframeIndex: number, keyframe: Partial<Keyframe>): void {
		const track = this.tracks.find((t) => t.id === trackId);
		if (track && keyframeIndex >= 0 && keyframeIndex < track.keyframes.length) {
			const existing = track.keyframes[keyframeIndex];
			if (existing) {
				track.keyframes[keyframeIndex] = {
					time: keyframe.time !== undefined ? keyframe.time : existing.time,
					value: keyframe.value !== undefined ? keyframe.value : existing.value,
					easing: keyframe.easing !== undefined ? keyframe.easing : existing.easing,
				};
				track.keyframes.sort((a, b) => a.time - b.time);
				this.updateDuration();
			}
		}
	}

	private updateDuration(): void {
		let maxTime = 0;
		for (const track of this.tracks) {
			for (const keyframe of track.keyframes) {
				if (keyframe.time > maxTime) {
					maxTime = keyframe.time;
				}
			}
		}
		this.duration = maxTime;
	}

	public getCurrentTime(): number {
		return this.currentTime;
	}

	public setCurrentTime(time: number): void {
		this.currentTime = Math.max(0, Math.min(time, this.duration));
	}

	public getDuration(): number {
		return this.duration;
	}

	public getTracks(): TimelineTrack[] {
		return this.tracks;
	}

	public getTrack(trackId: string): TimelineTrack | undefined {
		return this.tracks.find((t) => t.id === trackId);
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
		this.currentTime = 0;
	}

	private animate(): void {
		if (!this.isPlaying) return;

		const startTime = performance.now();
		const startOffset = this.currentTime;

		const frame = (timestamp: number) => {
			if (!this.isPlaying) return;

			const elapsed = timestamp - startTime;
			this.currentTime = Math.min(startOffset + elapsed, this.duration);

			if (this.currentTime >= this.duration) {
				this.pause();
				return;
			}

			this.animationFrameId = requestAnimationFrame(frame);
		};

		this.animationFrameId = requestAnimationFrame(frame);
	}

	public dispose(): void {
		this.pause();
		this.tracks = [];
		this.currentTime = 0;
		this.duration = 0;
	}
}
