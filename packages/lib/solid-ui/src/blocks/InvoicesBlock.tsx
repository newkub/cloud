/**
 * InvoicesBlock — billing history: status-filtered invoice list with a detail summary panel.
 */
import { createMemo, createSignal, For, Show, type JSX } from "solid-js";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { InvoiceCard, type InvoiceCardInvoice, type InvoiceStatus } from "../components/InvoiceCard";
import { OrderSummary } from "../components/OrderSummary";
import { Select } from "../components/Select";
import { Tabs, TabsList, TabsTrigger } from "../components/Tabs";

export interface InvoicesBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Invoices to list — newest first. */
	invoices: InvoiceCardInvoice[];
	/** Heading @default "Invoices" */
	title?: string;
	/** Supporting text under the heading. */
	description?: string;
	/** Called when a download action is triggered. */
	onDownload?: (invoice: InvoiceCardInvoice) => void;
	/** Called when an unpaid invoice should be paid. */
	onPay?: (invoice: InvoiceCardInvoice) => void;
}

type Filter = "all" | InvoiceStatus;

const statusLabel: Record<InvoiceStatus, string> = {
	paid: "Paid",
	due: "Due",
	overdue: "Overdue",
};

export function InvoicesBlock(props: InvoicesBlockProps) {
	const [filter, setFilter] = createSignal<Filter>("all");
	const [selectedId, setSelectedId] = createSignal(props.invoices[0]?.id ?? "");

	const visible = createMemo(() =>
		props.invoices.filter((invoice) => filter() === "all" || invoice.status === filter()),
	);
	const selected = createMemo(() => visible().find((invoice) => invoice.id === selectedId()) ?? visible()[0]);

	return (
		<div class={props.class}>
			<header class="mb-5 flex flex-wrap items-end justify-between gap-3">
				<div>
					<h2 class="text-lg font-semibold text-foreground">{props.title ?? "Invoices"}</h2>
					<Show when={props.description}>
						<p class="mt-1 text-xs text-muted-foreground">{props.description}</p>
					</Show>
				</div>
				<Tabs value={filter()} onValueChange={(value) => setFilter(value as Filter)}>
					<TabsList variant="pills">
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="paid">Paid</TabsTrigger>
						<TabsTrigger value="due">Due</TabsTrigger>
						<TabsTrigger value="overdue">Overdue</TabsTrigger>
					</TabsList>
				</Tabs>
			</header>

			<div class="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
				<div class="flex flex-col gap-3">
					<For each={visible()}>
						{(invoice) => (
							<InvoiceCard invoice={invoice} onDownload={props.onDownload} variant="outline" />
						)}
					</For>
					<Show when={visible().length === 0}>
						<EmptyState
							title={`No ${filter() === "all" ? "" : `${filter()} `}invoices`.trim()}
							description="Invoices appear here once a billing period closes."
							variant="outline"
						/>
					</Show>
				</div>

				<Show when={selected()}>
					{(invoice) => (
						<div class="flex flex-col gap-3 lg:sticky lg:top-6 lg:self-start">
							<Show when={visible().length > 1}>
								<Select
									value={invoice().id}
									onChange={setSelectedId}
									aria-label="Select invoice"
								>
									<For each={visible()}>
										{(option) => (
											<option value={option.id}>
												{option.id} — {statusLabel[option.status]}
											</option>
										)}
									</For>
								</Select>
							</Show>

							<OrderSummary
								title={`Invoice ${invoice().id}`}
								items={invoice().items.map((item) => ({
									name: item.label,
									quantity: item.qty,
									price: item.amount,
								}))}
								rows={[
									{ label: "Status", value: statusLabel[invoice().status] },
									...(invoice().issuedAt
										? [{ label: "Issued", value: invoice().issuedAt as string }]
										: []),
								]}
								total={invoice().total}
							/>

							<div class="flex gap-2">
								<Show when={invoice().status !== "paid"}>
									<Button
										type="button"
										variant="primary"
										class="flex-1"
										onClick={() => props.onPay?.(invoice())}
									>
										Pay {invoice().total}
									</Button>
								</Show>
								<Button
									type="button"
									variant="secondary"
									class="flex-1"
									onClick={() => props.onDownload?.(invoice())}
								>
									Download PDF
								</Button>
							</div>
						</div>
					)}
				</Show>
			</div>
		</div>
	);
}
