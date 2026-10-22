/**
 * SolidJS composable for Audio Reactive Animation
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createAudioReactive } from "../../../modules/animation/application/usecases/input-media/use-audio-reactive";
import type { AudioData, AudioReactiveOptions } from "../../../modules/animation/types";

export function useAudioReactive(options: AudioReactiveOptions = {}) {
	const [audioReactive, setAudioReactive] = createSignal<ReturnType<typeof createAudioReactive> | null>(null);
	const [isInitialized, setIsInitialized] = createSignal(false);
	const [audioData, setAudioData] = createSignal<AudioData>({
		frequencyData: new Uint8Array(0),
		timeDomainData: new Uint8Array(0),
		beatDetected: false,
		averageVolume: 0,
	});
	const [isPlaying, setIsPlaying] = createSignal(false);
	let animationFrameId: number | null = null;

	const initialize = async () => {
		const ar = createAudioReactive(options);
		await ar.initialize();
		setAudioReactive(ar);
		setIsInitialized(true);
	};

	const startAnalysis = () => {
		if (!isInitialized()) return;

		const analyze = () => {
			const ar = audioReactive();
			if (ar) {
				const data = ar.getAudioData();
				setAudioData(data);
			}
			if (isPlaying()) {
				animationFrameId = requestAnimationFrame(analyze);
			}
		};

		setIsPlaying(true);
		animationFrameId = requestAnimationFrame(analyze);
	};

	const stopAnalysis = () => {
		setIsPlaying(false);
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}
	};

	const dispose = () => {
		stopAnalysis();
		const ar = audioReactive();
		if (ar) {
			ar.dispose();
		}
		setIsInitialized(false);
	};

	// Auto-initialize on mount
	createEffect(() => {
		initialize();
		onCleanup(() => {
			dispose();
		});
	});

	return {
		initialize,
		startAnalysis,
		stopAnalysis,
		dispose,
		audioData,
		isInitialized,
		isPlaying,
	};
}
