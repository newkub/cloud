/**
 * ConfirmPopover — small inline confirmation bubble with confirm/cancel.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ConfirmPopoverProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Confirmation question */
	message?: string;
	/** Confirm button label @default "Confirm" */
	confirmLabel?: string;
	/** Cancel button label @default "Cancel" */
	cancelLabel?: string;
	/** Confirm button tone @default "destructive" */
	variant?: "primary" | "destructive";
	onConfirm?: () => void;
	onCancel?: () => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function ConfirmPopover(props: ConfirmPopoverProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"message",
		"confirmLabel",
		"cancelLabel",
		"variant",
		"onConfirm",
		"onCancel",
		"radius",
		"elevation",
	]);
	const confirmCls = () =>
		local.variant === "primary"
			? "bg-primary text-primary-foreground hover:bg-primary/90"
			: "bg-destructive text-destructive-foreground hover:bg-destructive/90";
	return (
		<div
			role="alertdialog"
			aria-label={local.message ?? "Are you sure?"}
			class={`solidui-confirm-popover w-64 max-w-[calc(100vw-2rem)] border border-border bg-surface p-3 ${radiusMap[local.radius ?? "lg"]} ${elevationMap[local.elevation ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<p class="text-sm text-foreground">{local.message ?? "Are you sure?"}</p>
			<div class="mt-3 flex justify-end gap-2">
				<button
					type="button"
					class="min-h-9 rounded-md border border-border bg-background px-3 py-1 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					onClick={local.onCancel}
				>
					{local.cancelLabel ?? "Cancel"}
				</button>
				<button
					type="button"
					class={`min-h-9 rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${confirmCls()}`}
					onClick={local.onConfirm}
				>
					{local.confirmLabel ?? "Confirm"}
				</button>
			</div>
		</div>
	);
}
