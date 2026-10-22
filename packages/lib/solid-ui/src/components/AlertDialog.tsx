/**
 * Alert dialog with title, description, and actions
 */

import { createFocusTrap, useEscapeKey } from "@wrikka/hooks";
import { type JSX, mergeProps, onCleanup, onMount, Show } from "solid-js";
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
import { Button } from "./Button";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-surface shadow-lg",
};

export interface AlertDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	title?: string;
	description?: string;
	children?: JSX.Element;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "sm" | "md" | "lg";
	class?: string;
	/** Corner radius. @default "xl" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

type AlertDialogContentProps = Required<Pick<AlertDialogProps, "confirmLabel" | "cancelLabel">> & AlertDialogProps;

function AlertDialogPanel(
	props: AlertDialogContentProps & { instanceId: number; setContentRef: (el: HTMLDivElement) => void },
) {
	const handleConfirm = () => {
		props.onOpenChange?.(false);
		props.onConfirm?.();
	};

	const handleCancel = () => {
		props.onOpenChange?.(false);
		props.onCancel?.();
	};

	return (
		<div
			ref={props.setContentRef}
			tabIndex={-1}
			class={`pointer-events-auto relative max-h-[90dvh] w-full max-w-lg overflow-y-auto border motion-safe:animate-[su-zoom-in_var(--su-transition-normal)] ${variantMap[props.variant ?? "default"]} ${paddingSizes[props.size ?? "lg"]} ${radiusMap[props.radius ?? "xl"]} ${props.elevation ? elevationMap[props.elevation] : ""} ${props.class ?? ""}`}
			role="alertdialog"
			aria-modal="true"
			aria-labelledby={props.title ? `alertdialog-title-${props.instanceId}` : undefined}
			aria-describedby={props.description ? `alertdialog-description-${props.instanceId}` : undefined}
		>
			<Show when={props.title}>
				<h2 id={`alertdialog-title-${props.instanceId}`} class="text-lg font-semibold text-foreground">
					{props.title}
				</h2>
			</Show>
			<Show when={props.description}>
				<p id={`alertdialog-description-${props.instanceId}`} class="mt-1 text-sm text-muted-foreground">
					{props.description}
				</p>
			</Show>
			<div class="mt-4">{props.children}</div>
			<div class="mt-6 flex justify-end gap-2">
				<Button variant="secondary" onClick={handleCancel}>
					{props.cancelLabel}
				</Button>
				<Button variant="primary" onClick={handleConfirm}>
					{props.confirmLabel}
				</Button>
			</div>
		</div>
	);
}

let alertDialogCount = 0;

function AlertDialogContent(props: AlertDialogContentProps) {
	let contentRef: HTMLDivElement | undefined;

	useEscapeKey(() => {
		props.onOpenChange?.(false);
		props.onCancel?.();
	});

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

	const handleCancel = () => {
		props.onOpenChange?.(false);
		props.onCancel?.();
	};

	return (
		<Portal>
			<div
				class="fixed inset-0 z-modal-backdrop bg-overlay/80 motion-safe:animate-[su-fade-in_var(--su-transition-normal)]"
				onClick={handleCancel}
				aria-hidden="true"
			/>
			<div class="fixed inset-0 z-modal flex items-center justify-center p-4 pointer-events-none" role="presentation">
				<AlertDialogPanel {...props} instanceId={++alertDialogCount} setContentRef={(el) => (contentRef = el)} />
			</div>
		</Portal>
	);
}

export function AlertDialog(props: AlertDialogProps) {
	const merged = mergeProps({ open: false, confirmLabel: "Confirm", cancelLabel: "Cancel" }, props);
	return (
		<Show when={merged.open}>
			<AlertDialogContent {...props} confirmLabel={merged.confirmLabel} cancelLabel={merged.cancelLabel} />
		</Show>
	);
}
