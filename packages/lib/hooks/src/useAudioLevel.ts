import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

/**
 * Live audio loudness (RMS, smoothed to roughly 0–1) from a MediaStream or a
 * media element — Web Audio `AnalyserNode` sampled on a rAF loop. The
 * AudioContext is created lazily once a source resolves and closed on cleanup;
 * a suspended context resumes on the next user gesture.
 *
 * Element sources are re-routed through the analyser back to the destination
 * so they stay audible. Re-analysing an element already bound to another
 * context throws — the hook then degrades to `0`.
 *
 * @param source — MediaStream / HTMLMediaElement or an accessor resolving to one
 * @returns Accessor for the level, `0` when silent or unsupported
 *
 * @example
 * const mic = useMediaStream({ audio: true });
 * const level = useAudioLevel(mic.stream);
 * <div style={{ width: `${level() * 100}%` }} />
 */
export function useAudioLevel(source: MaybeAccessor<MediaStream | HTMLMediaElement | undefined>): Accessor<number> {
	const [level, setLevel] = createSignal(0);

	createEffect(() => {
		const src = resolve(source);
		if (!src || typeof AudioContext === "undefined") return;

		const ctx = new AudioContext();
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 512;
		const data = new Uint8Array(analyser.fftSize);
		let node: MediaStreamAudioSourceNode | MediaElementAudioSourceNode;
		try {
			if (typeof MediaStream !== "undefined" && src instanceof MediaStream) {
				node = ctx.createMediaStreamSource(src);
			} else {
				node = ctx.createMediaElementSource(src as HTMLMediaElement);
				analyser.connect(ctx.destination);
			}
			node.connect(analyser);
		} catch {
			// element already bound elsewhere / unsupported source
			void ctx.close().catch(() => {});
			setLevel(0);
			return;
		}

		const resume = () => void ctx.resume().catch(() => {});
		if (ctx.state === "suspended") {
			resume();
			window.addEventListener("pointerdown", resume);
		}

		let raf = 0;
		const loop = () => {
			analyser.getByteTimeDomainData(data);
			let sum = 0;
			for (const byte of data) {
				const v = (byte - 128) / 128;
				sum += v * v;
			}
			setLevel(Math.min(1, Math.sqrt(sum / data.length) * 2.5));
			raf = requestAnimationFrame(loop);
		};
		loop();

		onCleanup(() => {
			cancelAnimationFrame(raf);
			window.removeEventListener("pointerdown", resume);
			void ctx.close().catch(() => {});
			setLevel(0);
		});
	});

	return level;
}
