/**
 * FocusTrap - keeps Tab focus cycling inside the wrapped content while active.
 */
import { type JSX, onCleanup, onMount, splitProps } from "solid-js";

export interface FocusTrapProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Disable the trap (e.g. while the overlay is closing). @default false */
	disabled?: boolean;
}

const FOCUSABLE =
	'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function FocusTrap(props: FocusTrapProps) {
	const [local, rest] = splitProps(props, ["class", "disabled", "children"]);
	let root: HTMLDivElement | undefined;

	const onKeyDown = (e: KeyboardEvent) => {
		if (local.disabled || e.key !== "Tab" || !root) return;
		const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
		if (items.length === 0) return;
		const first = items[0];
		const last = items[items.length - 1];
		const active = document.activeElement as HTMLElement | null;
		if (e.shiftKey && (active === first || !root.contains(active))) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && active === last) {
			e.preventDefault();
			first.focus();
		}
	};

	onMount(() => {
		document.addEventListener("keydown", onKeyDown, true);
		if (!local.disabled) {
			const first = root?.querySelector<HTMLElement>(FOCUSABLE);
			first?.focus();
		}
		onCleanup(() => document.removeEventListener("keydown", onKeyDown, true));
	});

	return (
		<div ref={root} class={`solidui-focus-trap ${local.class ?? ""}`} {...rest}>
			{local.children}
		</div>
	);
}
