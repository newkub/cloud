import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface UseDisplayMediaOptions {
	/** Video track constraints. @default true */
	video?: boolean | MediaTrackConstraints;
	/** Audio track constraints (tab/system audio). @default false */
	audio?: boolean | MediaTrackConstraints;
	/** Called after the stream starts. */
	onStart?: (stream: MediaStream) => void;
	/** Called when the stream stops — manually or when the user ends sharing. */
	onStop?: () => void;
	/** Listen for the browser "Stop sharing" action and run `onStop`. @default true */
	controls?: boolean;
}

export interface UseDisplayMediaReturn {
	/** The active screen-capture stream (`undefined` when idle). */
	stream: Accessor<MediaStream | undefined>;
	/** Whether `navigator.mediaDevices.getDisplayMedia` exists. */
	isSupported: Accessor<boolean>;
	/** Request the display stream — resolves to the stream or `undefined`. */
	start: () => Promise<MediaStream | undefined>;
	/** Stop every track and clear the stream. */
	stop: () => void;
}

/**
 * Screen/window capture via `getDisplayMedia`, exposed as reactive state. Call
 * `start()` from a user gesture; `stop()` releases every track. When `controls`
 * is enabled (default) the browser's own "Stop sharing" button is tracked — an
 * ended track tears down the stream and fires `onStop`. Tracks are always
 * released on cleanup.
 *
 * @param options — See {@link UseDisplayMediaOptions}
 * @returns `{ stream, isSupported, start, stop }`
 *
 * @example
 * const screen = useDisplayMedia({ onStop: () => setRecording(false) });
 * <button onClick={() => screen.start()}>share</button>
 * <video prop:srcObject={screen.stream()} autoplay muted />
 */
export function useDisplayMedia(options?: UseDisplayMediaOptions): UseDisplayMediaReturn {
	const [stream, setStream] = createSignal<MediaStream>();
	const [isSupported] = createSignal(
		typeof navigator !== "undefined" && typeof navigator.mediaDevices?.getDisplayMedia === "function",
	);
	let current: MediaStream | undefined;
	const watchEnded = options?.controls !== false;

	const onEnded = () => stop();

	const stop = () => {
		const s = current;
		if (!s) return;
		if (watchEnded) for (const track of s.getTracks()) track.removeEventListener("ended", onEnded);
		for (const track of s.getTracks()) track.stop();
		current = undefined;
		setStream(undefined);
		options?.onStop?.();
	};

	const start = async (): Promise<MediaStream | undefined> => {
		if (!isSupported()) return undefined;
		stop();
		try {
			const s = await navigator.mediaDevices.getDisplayMedia({
				video: options?.video ?? true,
				audio: options?.audio ?? false,
			});
			current = s;
			setStream(s);
			if (watchEnded) for (const track of s.getTracks()) track.addEventListener("ended", onEnded);
			options?.onStart?.(s);
			return s;
		} catch {
			return undefined;
		}
	};

	onCleanup(() => {
		const s = current;
		if (!s) return;
		if (watchEnded) for (const track of s.getTracks()) track.removeEventListener("ended", onEnded);
		for (const track of s.getTracks()) track.stop();
		current = undefined;
		setStream(undefined);
	});

	return { stream, isSupported, start, stop };
}
