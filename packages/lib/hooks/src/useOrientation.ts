import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface OrientationState {
	/** Rotation angle in degrees (0/90/180/270) */
	angle: Accessor<number>;
	/** "landscape" | "portrait" */
	type: Accessor<"landscape" | "portrait">;
	/** Whether the Screen Orientation API exists */
	supported: boolean;
}

export interface OrientationOptions {
	/** Fires after every orientation read — including the initial one */
	onChange?: (state: { angle: number; type: "landscape" | "portrait" }) => void;
}

/**
 * Reactive `screen.orientation` — angle + simplified type. Falls back to
 * inferring orientation from `window` dimensions (on `resize`) when the API
 * is missing, so `type()` still tracks viewport shape.
 *
 * @param options — `onChange` callback fired on each update
 * @returns `{ angle, type, supported }` accessors
 *
 * @example
 * const o = useOrientation({ onChange: ({ type }) => log(type) });
 * <p>{o.type()} {o.angle()}°</p>
 */
export function useOrientation(options?: OrientationOptions): OrientationState {
	const [angle, setAngle] = createSignal(0);
	const [type, setType] = createSignal<"landscape" | "portrait">("portrait");
	const supported = typeof screen !== "undefined" && !!screen.orientation;

	onMount(() => {
		const read = () => {
			const o = screen.orientation;
			const a = o?.angle ?? 0;
			const t: "landscape" | "portrait" = o
				? o.type.startsWith("landscape")
					? "landscape"
					: "portrait"
				: window.innerWidth >= window.innerHeight
					? "landscape"
					: "portrait";
			setAngle(a);
			setType(t);
			options?.onChange?.({ angle: a, type: t });
		};
		read();
		const target: Pick<EventTarget, "addEventListener" | "removeEventListener"> = screen.orientation ?? window;
		target.addEventListener(screen.orientation ? "change" : "resize", read);
		onCleanup(() => target.removeEventListener(screen.orientation ? "change" : "resize", read));
	});

	return { angle, type, supported };
}
