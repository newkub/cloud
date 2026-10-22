/**
 * Use case: Audio Reactive Animation
 * Creates and manages audio analysis for animations
 */

import { AudioReactive } from "../../../domain/models/input-media/audio-reactive";
import type { AudioData, AudioReactiveOptions } from "../../../types/index";

export function createAudioReactive(options: AudioReactiveOptions = {}) {
	const audioReactive = new AudioReactive(options);
	let isInitialized = false;

	return {
		initialize: async () => {
			if (!isInitialized) {
				await audioReactive.initialize();
				isInitialized = true;
			}
		},
		getAudioData: (): AudioData => {
			return audioReactive.getAudioData();
		},
		getFrequencyData: (): Uint8Array => {
			return audioReactive.getFrequencyData();
		},
		getTimeDomainData: (): Uint8Array => {
			return audioReactive.getTimeDomainData();
		},
		getAverageVolume: (): number => {
			return audioReactive.getAverageVolume();
		},
		dispose: () => {
			audioReactive.dispose();
			isInitialized = false;
		},
	};
}
