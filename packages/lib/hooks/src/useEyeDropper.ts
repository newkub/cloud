import { type Accessor, createSignal } from "solid-js";

interface EyeDropperLike {
	open(): Promise<{ sRGBHex: string }>;
}

type EyeDropperCtor = new () => EyeDropperLike;

const eyeDropper = (): EyeDropperCtor | undefined =>
	typeof window === "undefined" ? undefined : (window as { EyeDropper?: EyeDropperCtor }).EyeDropper;

export interface EyeDropperState {
	/** `window.EyeDropper` support flag */
	supported: boolean;
	/** Last picked color as `#rrggbb` */
	lastColor: Accessor<string | undefined>;
	/** Last error message (picking cancel is *not* an error) */
	error: Accessor<string | undefined>;
	/** Open the picker — resolves `undefined` on cancel or when unsupported */
	open: () => Promise<string | undefined>;
}

/**
 * EyeDropper API — screen color picker returning an sRGB hex string.
 * `supported` is `false` where `EyeDropper` is missing; `open()` then
 * resolves `undefined` instead of throwing.
 *
 * @returns `{ supported, lastColor, error, open }`
 *
 * @example
 * const dropper = useEyeDropper();
 * <button disabled={!dropper.supported} onClick={() => dropper.open()}>Pick color</button>
 */
export function useEyeDropper(): EyeDropperState {
	const supported = typeof window !== "undefined" && "EyeDropper" in window;
	const [lastColor, setLastColor] = createSignal<string>();
	const [error, setError] = createSignal<string>();

	const open = async () => {
		const Ctor = eyeDropper();
		if (!Ctor) return undefined;
		try {
			const { sRGBHex } = await new Ctor().open();
			setLastColor(sRGBHex);
			setError(undefined);
			return sRGBHex;
		} catch (e) {
			// AbortError = user pressed Escape — not a real failure.
			if (e instanceof DOMException && e.name === "AbortError") return undefined;
			setError(e instanceof Error ? e.message : "eyedropper failed");
			return undefined;
		}
	};

	return { supported, lastColor, error, open };
}
