/**
 * Toast - transient notification message.
 */
import { type JSX, mergeProps, Show } from "solid-js";
import { type Elevation, elevationMap, paddingSizes, type Radius, radiusMap, statusVariants } from "../lib/variants";

export type ToastVariant = "default" | "primary" | "info" | "success" | "warning" | "destructive";

export interface ToastProps {
	title?: string;
	description?: string;
	variant?: ToastVariant;
	size?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
	onClose?: () => void;
	children?: JSX.Element;
	class?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Toast(props: ToastProps) {
	const merged = mergeProps({ variant: "default" as ToastVariant, size: "md" as const }, props);
	return (
		<div
			class={`relative w-80 max-w-[calc(100vw-2rem)] border motion-safe:animate-[su-slide-up_var(--su-transition-normal)] ${statusVariants[merged.variant]} ${paddingSizes[merged.size]} ${radiusMap[merged.radius ?? "lg"]} ${elevationMap[merged.elevation ?? "md"]} ${merged.class ?? ""}`}
			role="status"
		>
			<Show when={merged.title}>
				<h4 class="mb-1 pr-9 text-sm font-semibold">{merged.title}</h4>
			</Show>
			<Show when={merged.description || merged.children}>
				<p class="pr-9 text-sm opacity-80">{merged.description ?? merged.children}</p>
			</Show>
			<Show when={merged.onClose}>
				<button
					type="button"
					onClick={() => merged.onClose?.()}
					class="absolute right-1.5 top-1.5 inline-flex h-9 w-9 items-center justify-center rounded-md opacity-70 transition-opacity hover:bg-muted hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					aria-label="Close"
				>
					<span aria-hidden="true">×</span>
				</button>
			</Show>
		</div>
	);
}
