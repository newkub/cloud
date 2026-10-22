import { onCleanup } from "solid-js";

export interface VibrateControls {
	/** `navigator.vibrate` support flag */
	supported: boolean;
	/** Vibrate — returns `false` when unsupported or rejected */
	vibrate: (pattern: VibratePattern) => boolean;
	/** Cancel any running pattern */
	stop: () => void;
}

/**
 * Vibration API — `vibrate(200)` or patterns like `[100, 50, 100]`.
 * `supported` is `false` where the API is missing; calls then no-op
 * instead of throwing. Cancels on unmount.
 *
 * @returns `{ supported, vibrate, stop }`
 *
 * @example
 * const vib = useVibrate();
 * <button onClick={() => vib.vibrate([100, 50, 100])}>Buzz</button>
 */
export function useVibrate(): VibrateControls {
	const supported = typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

	const vibrate = (pattern: VibratePattern) => (supported ? navigator.vibrate(pattern) : false);
	const stop = () => {
		if (supported) navigator.vibrate(0);
	};

	onCleanup(stop);
	return { supported, vibrate, stop };
}
