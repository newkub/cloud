import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface MediaStreamState {
	/** Live MediaStream once `start()` succeeds */
	stream: Accessor<MediaStream | undefined>;
	/** True while a stream is held and live */
	active: Accessor<boolean>;
	/** Last getUserMedia error message (e.g. permission denied) */
	error: Accessor<string | undefined>;
	/** Known media devices — labels fill in after permission is granted */
	devices: Accessor<MediaDeviceInfo[]>;
	/** Whether navigator.mediaDevices.getUserMedia exists */
	supported: boolean;
	/** Request the stream — pass overrides to replace the hook-level constraints */
	start: (overrides?: MediaStreamConstraints) => Promise<MediaStream | undefined>;
	/** Stop all tracks and clear the stream */
	stop: () => void;
}

/**
 * `getUserMedia` as signals — call `start()` (ideally from a user gesture) to
 * request the stream, `stop()` releases every track. Tracks are stopped and the
 * device list listener removed on unmount. `devices` refreshes on
 * `devicechange` and after a successful `start()` (labels need permission).
 *
 * @param constraints — Default MediaStreamConstraints for `start()`. @default { audio: true }
 * @returns `{ stream, active, error, devices, supported, start, stop }`
 *
 * @example
 * const cam = useMediaStream({ video: true, audio: false });
 * <button onClick={() => cam.start()}>enable camera</button>
 * <video prop:srcObject={cam.stream()} autoplay muted />
 */
export function useMediaStream(constraints?: MediaStreamConstraints): MediaStreamState {
	const [stream, setStream] = createSignal<MediaStream>();
	const [error, setError] = createSignal<string>();
	const [devices, setDevices] = createSignal<MediaDeviceInfo[]>([]);
	const supported = typeof navigator !== "undefined" && typeof navigator.mediaDevices?.getUserMedia === "function";
	let current: MediaStream | undefined;

	const stop = () => {
		for (const track of current?.getTracks() ?? []) track.stop();
		current = undefined;
		setStream(undefined);
	};

	const refreshDevices = async () => {
		if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) return;
		try {
			setDevices(await navigator.mediaDevices.enumerateDevices());
		} catch {
			/* enumeration can fail without permission — keep the old list */
		}
	};

	const start = async (overrides?: MediaStreamConstraints) => {
		if (!supported) {
			setError("getUserMedia unavailable");
			return undefined;
		}
		stop();
		setError(undefined);
		try {
			const next = await navigator.mediaDevices.getUserMedia(overrides ?? constraints ?? { audio: true });
			current = next;
			setStream(next);
			void refreshDevices();
			return next;
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
			return undefined;
		}
	};

	onMount(() => {
		void refreshDevices();
		const md = navigator.mediaDevices;
		md?.addEventListener("devicechange", refreshDevices);
		onCleanup(() => {
			md?.removeEventListener("devicechange", refreshDevices);
			stop();
		});
	});

	return { stream, active: () => stream()?.active === true, error, devices, supported, start, stop };
}
