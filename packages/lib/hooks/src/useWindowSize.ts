import { type Accessor, createMemo, createSignal, onCleanup, onMount } from "solid-js";

export interface WindowSize {
	width: Accessor<number>;
	height: Accessor<number>;
	/** `width >= 640` */
	sm: Accessor<boolean>;
	/** `width >= 768` */
	md: Accessor<boolean>;
	/** `width >= 1024` */
	lg: Accessor<boolean>;
}

/**
 * Reactive `window.innerWidth` / `innerHeight` — updates on resize.
 * Includes `sm`/`md`/`lg` breakpoint accessors (640/768/1024 px).
 *
 * @returns `{ width, height, sm, md, lg }` accessors
 *
 * @example
 * const size = useWindowSize();
 * <p>{size.width()} × {size.height()} — {size.md() ? "desktop" : "mobile"}</p>
 */
export function useWindowSize(): WindowSize {
	const [width, setWidth] = createSignal(0);
	const [height, setHeight] = createSignal(0);

	onMount(() => {
		const read = () => {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
		};
		read();
		window.addEventListener("resize", read);
		onCleanup(() => window.removeEventListener("resize", read));
	});

	return {
		width,
		height,
		sm: createMemo(() => width() >= 640),
		md: createMemo(() => width() >= 768),
		lg: createMemo(() => width() >= 1024),
	};
}
