/**
 * Audio Reactive Animation Types
 */

export interface AudioReactiveOptions {
	audioSource?: string | MediaStream;
	frequencyData?: boolean;
	beatDetection?: boolean;
	smoothing?: number;
	fftSize?: number;
	minDecibels?: number;
	maxDecibels?: number;
}

export interface AudioData {
	frequencyData: Uint8Array;
	timeDomainData: Uint8Array;
	beatDetected: boolean;
	averageVolume: number;
}
