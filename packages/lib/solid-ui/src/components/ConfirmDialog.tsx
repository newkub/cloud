/**
 * ConfirmDialog — modal confirmation built on the AlertDialog portal/focus-trap
 * pattern, with a danger tone and busy state.
 */
import { createFocusTrap, useEscapeKey } from "@wrikka/hooks";
import { type Accessor, type JSX, mergeProps, onCleanup, onMount, Show } from "solid-js";
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

export interface ConfirmDialogProps {
	/** Visibility — accepts a boolean or an accessor. */
	open?: boolean | Accessor<boolean>;
	onOpenChange?: (open: boolean) => void;
	title: JSX.Element;
	description?: JSX.Element;
	/** @default "Confirm" */
	confirmLabel?: string;
	/** @default "Cancel" */
	cancelLabel?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
	/** danger → destructive confirm button. @default "default" */
	tone?: "default" | "danger";
	/** Busy state — disables both buttons while pending. */
	busy?: boolean | Accessor<boolean>;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "sm" | "md" | "lg";
	class?: string;
	/** Corner radius. @default "xl" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

let confirmDialogCount = 0;

function ConfirmDialogContent(
	props: Required<Pick<ConfirmDialogProps, "confirmLabel" | "cancelLabel">> & ConfirmDialogProps,
) {
	let contentRef: HTMLDivElement | undefined;
	let confirmRef: HTMLButtonElement | undefined;
	const id = ++confirmDialogCount;
	const resolved = <T,>(v: T | Accessor<T> | undefined, fallback: T): T =>
		typeof v === "function" ? (v as Accessor<T>)() : (v ?? fallback);
	const busy = () => resolved(props.busy, false);
	const close = () => props.onOpenChange?.(false);

	const cancel = () => {
		if (busy()) return;
		props.onCancel?.();
		close();
	};
	const confirm = () => {
		if (busy()) return;
		props.onConfirm?.();
		close();
	};

	useEscapeKey(cancel);

	onMount(() => {
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const trap = contentRef ? createFocusTrap(contentRef) : null;
		trap?.activate();
		confirmRef?.focus();
		onCleanup(() => {
			document.body.style.overflow = prevOverflow;
			trap?.deactivate();
		});
	});

	return (
		<Portal>
			<div
				class="fixed inset-0 z-modal-backdrop bg-overlay/80 motion-safe:animate-[su-fade-in_var(--su-transition-normal)]"
				onClick={cancel}
				aria-hidden="true"
			/>
			<div class="pointer-events-none fixed inset-0 z-modal flex items-center justify-center p-4" role="presentation">
				<div
					ref={(el) => (contentRef = el)}
					tabIndex={-1}
					class={`pointer-events-auto max-h-[90dvh] w-full max-w-sm overflow-y-auto border motion-safe:animate-[su-zoom-in_var(--su-transition-normal)] ${variantMap[props.variant ?? "default"]} ${paddingSizes[props.size ?? "lg"]} ${radiusMap[props.radius ?? "xl"]} ${props.elevation ? elevationMap[props.elevation] : ""} ${props.class ?? ""}`}
					role="dialog"
					aria-modal="true"
					aria-labelledby={`confirm-dialog-title-${id}`}
					aria-describedby={props.description ? `confirm-dialog-description-${id}` : undefined}
					aria-busy={busy() || undefined}
				>
					<h2 id={`confirm-dialog-title-${id}`} class="text-lg font-semibold text-foreground">
						{props.title}
					</h2>
					<Show when={props.description}>
						<p id={`confirm-dialog-description-${id}`} class="mt-1 text-sm text-muted-foreground">
							{props.description}
						</p>
					</Show>
					<div class="mt-5 flex justify-end gap-2">
						<button
							type="button"
							disabled={busy()}
							class="min-h-9 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm font-medium text-foreground motion-safe:transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
							onClick={cancel}
						>
							{props.cancelLabel}
						</button>
						<button
							ref={(el) => (confirmRef = el)}
							type="button"
							disabled={busy()}
							class={`min-h-9 rounded-md px-3 py-1.5 text-sm font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${
								props.tone === "danger"
									? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
									: "bg-primary text-primary-foreground hover:bg-primary/90"
							}`}
							onClick={confirm}
						>
							{props.confirmLabel}
						</button>
					</div>
				</div>
			</div>
		</Portal>
	);
}

export function ConfirmDialog(props: ConfirmDialogProps) {
	const merged = mergeProps({ confirmLabel: "Confirm", cancelLabel: "Cancel" }, props);
	const isOpen = () => (typeof props.open === "function" ? props.open() : !!props.open);
	return (
		<Show when={isOpen()}>
			<ConfirmDialogContent {...merged} />
		</Show>
	);
}
