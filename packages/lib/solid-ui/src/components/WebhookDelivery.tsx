/**
 * WebhookDelivery - webhook delivery row: event, status pill, response code/duration and expandable detail.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { chipVariants } from "../lib/variants";

export type WebhookDeliveryStatus = "delivered" | "failed" | "pending";

export interface WebhookDeliveryProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Event name, e.g. "invoice.paid". */
	event: string;
	/** Delivery status. */
	status: WebhookDeliveryStatus;
	/** HTTP response code, e.g. 200. */
	code?: number;
	/** Response duration text, e.g. "184ms". */
	duration?: string;
	/** Delivery timestamp text, e.g. "2m ago". */
	at?: string;
	/** Expandable detail content — a chevron toggle reveals this region. */
	details?: JSX.Element;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const statusChip: Record<WebhookDeliveryStatus, string> = {
	delivered: chipVariants.success,
	failed: chipVariants.destructive,
	pending: chipVariants.warning,
};

const statusDot: Record<WebhookDeliveryStatus, string> = {
	delivered: "bg-success",
	failed: "bg-destructive",
	pending: "bg-warning",
};

export function WebhookDelivery(props: WebhookDeliveryProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"event",
		"status",
		"code",
		"duration",
		"at",
		"details",
		"unstyled",
	]);
	const [open, setOpen] = createSignal(false);

	const meta = () =>
		[local.code !== undefined ? `HTTP ${local.code}` : null, local.duration ?? null, local.at ?? null]
			.filter(Boolean)
			.join(" · ");

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: `solidui-webhook-delivery rounded-md transition-colors hover:bg-accent/50 ${local.class ?? ""}`.trim();

	return (
		<div class={className()} {...rest}>
			<div class="flex items-center gap-3 px-3 py-2">
				<Show when={local.details}>
					<button
						type="button"
						class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						aria-label={open() ? "Hide delivery detail" : "Show delivery detail"}
						aria-expanded={open()}
						onClick={() => setOpen((v) => !v)}
					>
						<NamedIcon
							name="chevron-down"
							class={`h-3.5 w-3.5 transition-transform motion-reduce:transition-none ${open() ? "rotate-180" : ""}`}
						/>
					</button>
				</Show>
				<div class="min-w-0 flex-1">
					<span class="block truncate font-mono text-sm text-foreground">{local.event}</span>
					<Show when={meta()}>
						<span class="block text-2xs tabular-nums text-muted-foreground">{meta()}</span>
					</Show>
				</div>
				<span
					class={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-2xs font-medium capitalize ${statusChip[local.status]}`}
				>
					<span class={`h-1.5 w-1.5 rounded-full ${statusDot[local.status]}`} aria-hidden="true" />
					{local.status}
				</span>
			</div>
			<Show when={open()}>
				<div class="border-t border-border/50 px-3 py-2 text-xs text-muted-foreground">{local.details}</div>
			</Show>
		</div>
	);
}
