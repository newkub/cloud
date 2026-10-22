/**
 * ImagePeek - click-to-zoom image overlay.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ImagePeekProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Controlled open state */
	open?: boolean;
	/** Uncontrolled initial open */
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Panel title */
	title?: string;
	/** Panel description */
	description?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Image src */
	src?: string;
	/** Image alt */
	alt?: string;
}

export function ImagePeek(props: ImagePeekProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"open",
		"defaultOpen",
		"onOpenChange",
		"title",
		"description",
		"radius",
		"elevation",
		"children",
		"src",
		"alt",
	]);
	const [internal, setInternal] = createSignal(local.defaultOpen ?? false);
	const open = () => (local.open !== undefined ? local.open : internal());
	const close = () => {
		setInternal(false);
		local.onOpenChange?.(false);
	};
	return (
		<Show when={open()}>
			<Portal>
				<div
					class="fixed inset-0 z-modal-backdrop bg-overlay/80 motion-safe:animate-[su-fade-in_var(--su-transition-normal)]"
					onClick={close}
					aria-hidden="true"
				/>
				<div
					role="dialog"
					aria-modal="true"
					aria-label={local.title ?? "ImagePeek"}
					class={`solidui-image-peek fixed left-1/2 top-1/2 z-modal w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-border bg-surface p-6 ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : "shadow-xl"} ${local.class ?? ""}`.trim()}
					{...rest}
				>
					<div class="mb-4 flex items-start justify-between gap-4">
						<div>
							<Show when={local.title}>
								<h2 class="text-base font-semibold text-foreground">{local.title}</h2>
							</Show>
							<Show when={local.description}>
								<p class="mt-1 text-sm text-muted-foreground">{local.description}</p>
							</Show>
						</div>
						<button
							type="button"
							class="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							aria-label="Close"
							onClick={close}
						>
							✕
						</button>
					</div>
					{local.children}
				</div>
			</Portal>
		</Show>
	);
}
