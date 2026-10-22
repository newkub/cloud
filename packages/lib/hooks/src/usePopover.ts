import { type Accessor, createSignal, onCleanup } from "solid-js";

export type PopoverElement = HTMLElement & {
	showPopover?: () => void;
	hidePopover?: () => void;
	togglePopover?: (force?: boolean) => boolean;
};

export interface PopoverControls {
	/** Whether the Popover API (`showPopover`) exists on HTMLElement */
	supported: boolean;
	/** Open state — tracks `toggle` events and manual calls; pure-signal fallback when unsupported */
	open: Accessor<boolean>;
	/** Assign as `ref` on the element carrying the `popover` attribute */
	ref: (el: PopoverElement | undefined) => void;
	/** Show the popover (native `showPopover` when present, else just flips `open`) */
	show: () => void;
	/** Hide the popover (native `hidePopover` when present, else just flips `open`) */
	hide: () => void;
	/** Toggle — pass `force` to pick a target state */
	toggle: (force?: boolean) => void;
}

/**
 * Popover API driver — wires `showPopover`/`hidePopover` to a reactive `open`
 * signal and mirrors native `toggle` events back into it. Without the API the
 * signal still flips, so the same markup degrades to a plain conditional.
 *
 * @param initial — Initial open state. @default false
 * @returns `{ supported, open, ref, show, hide, toggle }`
 *
 * @example
 * const pop = usePopover();
 * <button popovertarget="menu">menu</button>
 * <div id="menu" popover ref={pop.ref}><Show when={pop.open()}>…</Show></div>
 */
export function usePopover(initial = false): PopoverControls {
	const supported = typeof HTMLElement !== "undefined" && "showPopover" in HTMLElement.prototype;
	const [open, setOpen] = createSignal(initial);
	let el: PopoverElement | undefined;
	let detach: (() => void) | undefined;

	const ref = (node: PopoverElement | undefined) => {
		detach?.();
		detach = undefined;
		el = node;
		if (!node || typeof node.addEventListener !== "function") return;
		const onToggle = (e: Event) => setOpen((e as Event & { newState?: string }).newState === "open");
		node.addEventListener("toggle", onToggle);
		detach = () => node.removeEventListener("toggle", onToggle);
	};
	onCleanup(() => detach?.());

	const run = (method: "showPopover" | "hidePopover", next: boolean) => {
		const target = el;
		if (target && typeof target[method] === "function") {
			try {
				target[method]();
			} catch {
				// InvalidStateError (already open / not in DOM) — keep the flag in sync anyway
			}
		}
		setOpen(next);
	};

	return {
		supported,
		open,
		ref,
		show: () => run("showPopover", true),
		hide: () => run("hidePopover", false),
		toggle: (force?: boolean) => ((force ?? !open()) ? run("showPopover", true) : run("hidePopover", false)),
	};
}
