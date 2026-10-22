import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface HoverState {
	/** Attach to the element to track */
	ref: (el: HTMLElement) => void;
	/** True while the pointer is over the element */
	hovered: Accessor<boolean>;
}

/**
 * Track pointer hover on an element — rebinds when the bound element changes.
 * `hoverDelay` postpones the enter transition (leaving cancels a pending
 * enter); `leaveDelay` does the same for the leave transition.
 *
 * @param options — `hoverDelay`/`leaveDelay` in ms. @default 0
 * @returns `{ ref, hovered }` — attach `ref` to the element
 *
 * @example
 * const { ref, hovered } = useHover({ hoverDelay: 200 });
 * <div ref={ref}>{hovered() ? "hovering" : "not hovering"}</div>
 */
export function useHover(options?: {
	/** Delay the enter transition by ms. @default 0 */
	hoverDelay?: number;
	/** Delay the leave transition by ms. @default 0 */
	leaveDelay?: number;
}): HoverState {
	const [el, setEl] = createSignal<HTMLElement>();
	const [hovered, setHovered] = createSignal(false);
	const enterDelay = options?.hoverDelay ?? 0;
	const exitDelay = options?.leaveDelay ?? 0;

	createEffect(() => {
		const target = el();
		if (!target) return;
		let timer: ReturnType<typeof setTimeout> | undefined;
		const set = (v: boolean, delay: number) => {
			clearTimeout(timer);
			if (delay > 0) timer = setTimeout(() => setHovered(v), delay);
			else setHovered(v);
		};
		const enter = () => set(true, enterDelay);
		const leave = () => set(false, exitDelay);
		target.addEventListener("pointerenter", enter);
		target.addEventListener("pointerleave", leave);
		onCleanup(() => {
			clearTimeout(timer);
			target.removeEventListener("pointerenter", enter);
			target.removeEventListener("pointerleave", leave);
			setHovered(false);
		});
	});

	return { ref: setEl, hovered };
}
