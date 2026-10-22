/**
 * BottomSheet - mobile sheet that slides up from the bottom edge.
 */

import { createFocusTrap, useEscapeKey } from "@wrikka/hooks";
import { type JSX, mergeProps, onCleanup, onMount, Show, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-background shadow-lg",
};

export interface BottomSheetProps extends JSX.HTMLAttributes<HTMLDivElement> {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	title?: string;
	dismissible?: boolean;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "sm" | "md" | "lg";
	/** Top corner radius. @default "xl" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const topRadiusMap: Record<Radius, string> = {
	none: "rounded-t-none",
	sm: "rounded-t",
	md: "rounded-t-md",
	lg: "rounded-t-lg",
	xl: "rounded-t-xl",
	"2xl": "rounded-t-2xl",
	"3xl": "rounded-t-3xl",
	full: "rounded-t-full",
};

function BottomSheetContent(props: BottomSheetProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"children",
		"title",
		"dismissible",
		"onOpenChange",
		"radius",
		"elevation",
	]);

	const merged = mergeProps({ dismissible: true }, local);
	let contentRef: HTMLDivElement | undefined;

	useEscapeKey(() => merged.onOpenChange?.(false), { when: () => merged.dismissible });

	onMount(() => {
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		const trap = contentRef ? createFocusTrap(contentRef) : null;
		trap?.activate();

		onCleanup(() => {
			document.body.style.overflow = prevOverflow;
			trap?.deactivate();
		});
	});

	const close = () => {
		if (merged.dismissible) merged.onOpenChange?.(false);
	};

	return (
		<Portal>
			<div
				class="fixed inset-0 z-modal-backdrop bg-overlay/60 motion-safe:animate-[su-fade-in_var(--su-transition-normal)]"
				onClick={close}
				aria-hidden="true"
			/>
			<div class="pointer-events-none fixed inset-x-0 bottom-0 z-modal flex justify-center" role="presentation">
				<div
					ref={(el) => (contentRef = el)}
					tabIndex={-1}
					class={`pointer-events-auto max-h-[85dvh] w-full max-w-lg overflow-y-auto border-t pb-[env(safe-area-inset-bottom)] motion-safe:animate-[su-slide-up_var(--su-transition-slow)] ${variantMap[local.variant ?? "default"]} ${paddingSizes[local.size ?? "md"]} ${topRadiusMap[local.radius ?? "xl"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`}
					role="dialog"
					aria-modal="true"
					aria-label={local.title ?? "Bottom sheet"}
					{...rest}
				>
					<div class="mx-auto mb-3 h-1 w-10 rounded-full bg-muted-foreground/30" aria-hidden="true" />
					<Show when={local.title}>
						<h2 class="mb-2 text-base font-semibold text-foreground">{local.title}</h2>
					</Show>
					<div>{local.children}</div>
				</div>
			</div>
		</Portal>
	);
}

export function BottomSheet(props: BottomSheetProps) {
	const merged = mergeProps({ open: false }, props);
	return (
		<Show when={merged.open}>
			<BottomSheetContent {...merged} />
		</Show>
	);
}
