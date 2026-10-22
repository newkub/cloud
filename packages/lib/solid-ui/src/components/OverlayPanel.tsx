/**
 * Shared overlay panel — backdrop, focus trap, Escape close, slide-in from a side.
 * Used by Drawer and Sheet.
 */

import { createFocusTrap, useEscapeKey } from "@wrikka/hooks";
import { createSignal, type JSX, onCleanup, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-surface shadow-lg",
};

export type OverlaySide = "left" | "right" | "top" | "bottom";

export interface OverlayPanelProps {
	onOpenChange?: (open: boolean) => void;
	title?: string;
	description?: string;
	side?: OverlaySide;
	children?: JSX.Element;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "sm" | "md" | "lg";
	class?: string;
	/** ID prefix for aria labelling, e.g. "drawer" or "sheet" */
	idPrefix?: string;
	defaultSide?: OverlaySide;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

interface SideStyle {
	container: string;
	open: string;
	closed: string;
}

const sideMap: Record<OverlaySide, SideStyle> = {
	left: {
		container:
			"bottom-0 left-0 top-0 h-full w-full max-w-sm rounded-r-xl pl-[env(safe-area-inset-left)] pb-[env(safe-area-inset-bottom)]",
		open: "translate-x-0",
		closed: "-translate-x-full",
	},
	right: {
		container:
			"bottom-0 right-0 top-0 h-full w-full max-w-sm rounded-l-xl pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]",
		open: "translate-x-0",
		closed: "translate-x-full",
	},
	top: {
		container:
			"left-0 right-0 top-0 w-full max-h-[min(24rem,85dvh)] overflow-y-auto rounded-b-xl pt-[env(safe-area-inset-top)]",
		open: "translate-y-0",
		closed: "-translate-y-full",
	},
	bottom: {
		container:
			"bottom-0 left-0 right-0 w-full max-h-[min(24rem,85dvh)] overflow-y-auto rounded-t-xl pb-[env(safe-area-inset-bottom)]",
		open: "translate-y-0",
		closed: "translate-y-full",
	},
};

let panelCount = 0;

export function OverlayPanel(props: OverlayPanelProps) {
	const [mounted, setMounted] = createSignal(false);
	const style = () => sideMap[props.side ?? props.defaultSide ?? "right"];
	const id = ++panelCount;
	const titleId = `${props.idPrefix ?? "overlay"}-title-${id}`;
	const descriptionId = `${props.idPrefix ?? "overlay"}-description-${id}`;
	let contentRef: HTMLDivElement | undefined;

	useEscapeKey(() => props.onOpenChange?.(false));

	onMount(() => {
		setMounted(true);
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		const trap = contentRef ? createFocusTrap(contentRef) : null;
		trap?.activate();

		onCleanup(() => {
			document.body.style.overflow = prevOverflow;
			trap?.deactivate();
		});
	});

	return (
		<Portal>
			<div
				class="fixed inset-0 z-modal-backdrop bg-overlay/80 motion-safe:animate-[su-fade-in_var(--su-transition-normal)]"
				onClick={() => props.onOpenChange?.(false)}
				aria-hidden="true"
			/>
			<div
				ref={(el) => (contentRef = el)}
				tabIndex={-1}
				class={`fixed z-modal border transition-transform duration-300 ease-out motion-reduce:transition-none ${variantMap[props.variant ?? "default"]} ${paddingSizes[props.size ?? "lg"]} ${style().container} ${mounted() ? style().open : style().closed} ${props.radius ? radiusMap[props.radius] : ""} ${props.elevation ? elevationMap[props.elevation] : ""} ${props.class ?? ""}`}
				role="dialog"
				aria-modal="true"
				aria-labelledby={props.title ? titleId : undefined}
				aria-describedby={props.description ? descriptionId : undefined}
			>
				<Show when={props.title}>
					<h2 id={titleId} class="text-lg font-semibold text-foreground">
						{props.title}
					</h2>
				</Show>
				<Show when={props.description}>
					<p id={descriptionId} class="mt-1 text-sm text-muted-foreground">
						{props.description}
					</p>
				</Show>
				<div class="mt-4">{props.children}</div>
			</div>
		</Portal>
	);
}
