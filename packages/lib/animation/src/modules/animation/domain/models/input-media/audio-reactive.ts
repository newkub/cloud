/**
 * Audio Reactive Domain Model
 * Handles audio analysis and beat detection for animations
 */

import type { AudioData, AudioReactiveOptions } from "../../../types";

export class AudioReactive {
	private audioContext: AudioContext | null = null;
	private analyser: AnalyserNode | null = null;
	private source: MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null = null;
	private audioElement: HTMLAudioElement | null = null;
	private options: AudioReactiveOptions;
	private frequencyData: Uint8Array;
	private timeDomainData: Uint8Array;
	private isInitialized = false;
	private beatThreshold = 0.5;
	private previousVolume = 0;

	constructor(options: AudioReactiveOptions = {}) {
		this.options = {
			frequencyData: true,
			beatDetection: true,
			smoothing: 0.8,
			fftSize: 2048,
			minDecibels: -90,
			maxDecibels: -10,
			...options,
		};
		this.frequencyData = new Uint8Array(this.options.fftSize ?? 2048);
		this.timeDomainData = new Uint8Array(this.options.fftSize ?? 2048);
	}

	public async initialize(): Promise<void> {
		if (this.isInitialized) return;

		try {
			const w = window as Window & { webkitAudioContext?: typeof AudioContext };
			const AudioCtor = window.AudioContext ?? w.webkitAudioContext;
			if (!AudioCtor) throw new Error("AudioContext is not supported in this browser");
			this.audioContext = new AudioCtor();

			if (typeof this.options.audioSource === "string") {
				// Load from URL
				this.audioElement = new Audio(this.options.audioSource);
				this.audioElement.crossOrigin = "anonymous";
				await this.audioElement.play();
				this.source = this.audioContext.createMediaElementSource(this.audioElement);
			} else if (this.options.audioSource instanceof MediaStream) {
				// Use microphone
				this.source = this.audioContext.createMediaStreamSource(this.options.audioSource);
			} else {
				// Default to microphone
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				this.source = this.audioContext.createMediaStreamSource(stream);
			}

			this.analyser = this.audioContext.createAnalyser();
			this.analyser.fftSize = this.options.fftSize ?? 2048;
			this.analyser.smoothingTimeConstant = this.options.smoothing ?? 0.8;
			this.analyser.minDecibels = this.options.minDecibels ?? -90;
			this.analyser.maxDecibels = this.options.maxDecibels ?? -10;

			if (this.source) {
				this.source.connect(this.analyser);
				this.analyser.connect(this.audioContext.destination);
			}

			this.isInitialized = true;
		} catch (error) {
			console.error("Failed to initialize audio:", error);
			throw error;
		}
	}

	public getAudioData(): AudioData {
		if (!this.analyser || !this.isInitialized) {
			return {
				frequencyData: new Uint8Array(0),
				timeDomainData: new Uint8Array(0),
				beatDetected: false,
				averageVolume: 0,
			};
		}

		if (this.options.frequencyData) {
			this.analyser.getByteFrequencyData(this.frequencyData as unknown as Uint8Array<ArrayBuffer>);
		}

		this.analyser.getByteTimeDomainData(this.timeDomainData as unknown as Uint8Array<ArrayBuffer>);

		const averageVolume = this.calculateAverageVolume();
		const beatDetected = this.options.beatDetection ? this.detectBeat(averageVolume) : false;

		return {
			frequencyData: this.frequencyData.slice(),
			timeDomainData: this.timeDomainData.slice(),
			beatDetected,
			averageVolume,
		};
	}

	private calculateAverageVolume(): number {
		if (!this.options.frequencyData) return 0;

		let sum = 0;
		const length = this.frequencyData.length;
		for (let i = 0; i < length; i++) {
			const value = this.frequencyData[i];
			if (value !== undefined) {
				sum += value;
			}
		}
		return length > 0 ? sum / length : 0;
	}

	private detectBeat(currentVolume: number): boolean {
		const volumeChange = currentVolume - this.previousVolume;
		this.previousVolume = currentVolume;

		// Simple beat detection based on volume spike
		return volumeChange > this.beatThreshold * 255;
	}

	public getFrequencyData(): Uint8Array {
		return this.frequencyData;
	}

	public getTimeDomainData(): Uint8Array {
		return this.timeDomainData;
	}

	public getAverageVolume(): number {
		return this.calculateAverageVolume();
	}

	public dispose(): void {
		if (this.source) {
			this.source.disconnect();
		}
		if (this.analyser) {
			this.analyser.disconnect();
		}
		if (this.audioContext) {
			this.audioContext.close();
		}
		if (this.audioElement) {
			this.audioElement.pause();
			this.audioElement = null;
		}
		this.isInitialized = false;
	}
}
