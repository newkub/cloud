import { type Accessor, createEffect, createSignal, onCleanup, untrack } from "solid-js";

export type PresencePhase = "entering" | "entered" | "exiting" | "exited";

export interface PresenceOptions {
	/** Milliseconds each transition runs before settling. @default 200 */
	duration?: number;
	/** Called once the exit transition completes and the node unmounts. */
	onExited?: () => void;
}

export interface PresenceState {
	/** Keep children in the DOM while true — stays true through the "exiting" phase. */
	mounted: Accessor<boolean>;
	/** Current phase — drives enter/exit classes or styles. */
	phase: Accessor<PresencePhase>;
}

/**
 * Animated mount/unmount — tracks `visible` and keeps children mounted for
 * `duration` ms after it goes false so exit transitions can play. `phase()`
 * walks `"entering" → "entered"` on show and `"exiting" → "exited"` on hide;
 * `onExited` fires when the node finally leaves the DOM.
 *
 * @param visible — Accessor driving visibility
 * @param options — `duration` (ms, default 200) and `onExited`
 * @returns `{ mounted, phase }`
 *
 * @example
 * const p = usePresence(open, { duration: 300 });
 * <Show when={p.mounted()}>
 *   <div class={p.phase() === "exiting" ? "opacity-0" : "opacity-100"}>card</div>
 * </Show>
 */
export function usePresence(visible: Accessor<boolean>, options?: PresenceOptions): PresenceState {
	const duration = options?.duration ?? 200;
	const [mounted, setMounted] = createSignal(visible());
	const [phase, setPhase] = createSignal<PresencePhase>(visible() ? "entering" : "exited");
	let timer: ReturnType<typeof setTimeout> | undefined;

	const cancel = () => {
		clearTimeout(timer);
		timer = undefined;
	};

	createEffect(() => {
		const v = visible();
		cancel();
		if (v) {
			setMounted(true);
			setPhase("entering");
			timer = setTimeout(() => {
				timer = undefined;
				setPhase("entered");
			}, duration);
			return;
		}
		if (!untrack(mounted) && untrack(phase) === "exited") return;
		setMounted(true);
		setPhase("exiting");
		timer = setTimeout(() => {
			timer = undefined;
			setPhase("exited");
			setMounted(false);
			options?.onExited?.();
		}, duration);
	});

	onCleanup(cancel);

	return { mounted, phase };
}
