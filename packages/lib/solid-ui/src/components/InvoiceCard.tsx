/**
 * InvoiceCard — invoice summary: number, status chip, line items, total and download action.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";
import { Button } from "./Button";

export type InvoiceStatus = "paid" | "due" | "overdue";

export interface InvoiceItem {
	/** Line label, e.g. "Pro plan — annual". */
	label: string;
	/** Quantity — shown when > 1. @default 1 */
	qty?: number;
	/** Formatted amount, e.g. "$99.00". */
	amount: string;
}

export interface InvoiceCardInvoice {
	/** Invoice number, e.g. "INV-2041". */
	id: string;
	/** Payment status — controls the chip color. */
	status: InvoiceStatus;
	/** Line items. */
	items: InvoiceItem[];
	/** Formatted total, e.g. "$148.00". */
	total: string;
	/** Currency code shown next to the total. @default "USD" */
	currency?: string;
	/** Issue date text, e.g. "Sep 1, 2026". */
	issuedAt?: string;
}

export interface InvoiceCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Invoice to render. */
	invoice?: InvoiceCardInvoice;
	/** Called when the download button is clicked. */
	onDownload?: (invoice: InvoiceCardInvoice) => void;
	/** Surface variant. @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. @default "lg" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const statusChip: Record<InvoiceStatus, string> = {
	paid: "border-success/30 bg-success/10 text-success",
	due: "border-warning/30 bg-warning/10 text-warning",
	overdue: "border-destructive/30 bg-destructive/10 text-destructive",
};

const statusLabel: Record<InvoiceStatus, string> = {
	paid: "Paid",
	due: "Due",
	overdue: "Overdue",
};

export function InvoiceCard(props: InvoiceCardProps) {
	const [local, rest] = splitProps(props, ["class", "invoice", "onDownload", "variant", "radius", "elevation"]);
	return (
		<div
			class={`solidui-invoice-card border p-4 ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-center justify-between gap-2">
				<div class="min-w-0">
					<span class="block truncate font-mono text-sm font-semibold text-foreground">#{local.invoice?.id}</span>
					<Show when={local.invoice?.issuedAt}>
						<span class="text-2xs text-muted-foreground">Issued {local.invoice?.issuedAt}</span>
					</Show>
				</div>
				<span
					class={`shrink-0 rounded-full border px-2 py-0.5 text-2xs font-semibold ${statusChip[local.invoice?.status ?? "due"]}`}
				>
					{statusLabel[local.invoice?.status ?? "due"]}
				</span>
			</div>
			<table class="mt-3 w-full text-xs">
				<tbody>
					<For each={local.invoice?.items}>
						{(item) => (
							<tr class="border-b border-border/50 last:border-0">
								<td class="py-1.5 pr-2 text-foreground">
									{item.label}
									<Show when={(item.qty ?? 1) > 1}>
										<span class="text-muted-foreground"> ×{item.qty}</span>
									</Show>
								</td>
								<td class="py-1.5 text-right tabular-nums text-muted-foreground">{item.amount}</td>
							</tr>
						)}
					</For>
				</tbody>
			</table>
			<div class="mt-2 flex items-baseline justify-between border-t border-border pt-2">
				<span class="text-xs font-medium text-muted-foreground">
					Total{local.invoice?.currency ? ` (${local.invoice?.currency})` : ""}
				</span>
				<span class="text-sm font-semibold tabular-nums text-foreground">{local.invoice?.total}</span>
			</div>
			<Show when={local.onDownload}>
				<div class="mt-3 flex justify-end">
					<Button variant="default" size="sm" onClick={() => local.invoice && local.onDownload?.(local.invoice)}>
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
						</svg>
						Download
					</Button>
				</div>
			</Show>
		</div>
	);
}
