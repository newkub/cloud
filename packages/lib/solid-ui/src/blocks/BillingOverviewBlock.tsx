import { For, Show, type JSX } from "solid-js";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/Card";
import { Divider } from "../components/Divider";
import { InvoiceCard, type InvoiceCardInvoice } from "../components/InvoiceCard";
import { UsageMeter } from "../components/UsageMeter";

export interface UsageLine {
	label: string;
	used: number;
	limit: number;
	unit?: string;
	hint?: string;
}

export interface BillingOverviewBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	planName: string;
	planPrice: string;
	/** Billing period label, e.g. "Billed monthly". */
	period?: string;
	renewsOn?: string;
	usage?: UsageLine[];
	paymentMethod?: { brand: string; last4: string; expires: string };
	latestInvoice?: InvoiceCardInvoice;
	onManagePlan?: () => void;
	onUpdatePayment?: () => void;
	onDownloadInvoice?: (invoice: InvoiceCardInvoice) => void;
}

/** Current plan, metered usage, payment method and the latest invoice in one view. */
export function BillingOverviewBlock(props: BillingOverviewBlockProps) {
	return (
		<div class={`flex flex-col gap-4 ${props.class ?? ""}`}>
			<div class="grid gap-4 lg:grid-cols-3">
				<Card class="lg:col-span-2">
					<CardHeader>
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div>
								<p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current plan</p>
								<h2 class="mt-1 text-xl font-semibold tracking-tight">{props.planName}</h2>
								<p class="text-sm text-muted-foreground">
									{props.planPrice} · {props.period ?? "Billed monthly"}
								</p>
							</div>
							<Badge variant="success">Active</Badge>
						</div>
					</CardHeader>
					<CardContent class="flex flex-col gap-4">
						<Show when={props.renewsOn}>
							<p class="text-sm text-muted-foreground">Renews on {props.renewsOn}</p>
						</Show>
						<Divider />
						<div class="flex flex-col gap-4">
							<For each={props.usage ?? []}>
								{(line) => (
									<div class="flex flex-col gap-1">
										<UsageMeter label={line.label} used={line.used} limit={line.limit} unit={line.unit} />
										<Show when={line.hint}>
											<p class="text-xs text-muted-foreground">{line.hint}</p>
										</Show>
									</div>
								)}
							</For>
						</div>
					</CardContent>
					<CardFooter class="flex flex-wrap gap-2">
						<Button variant="primary" onClick={props.onManagePlan}>
							Change plan
						</Button>
						<Button variant="secondary" onClick={props.onUpdatePayment}>
							Update payment
						</Button>
					</CardFooter>
				</Card>

				<div class="flex flex-col gap-4">
					<Card>
						<CardHeader>
							<h3 class="text-base font-semibold">Payment method</h3>
						</CardHeader>
						<CardContent>
							<Show
								when={props.paymentMethod}
								fallback={<p class="text-sm text-muted-foreground">No card on file.</p>}
							>
								{(method) => (
									<div class="flex items-center justify-between gap-3">
										<div>
											<p class="text-sm font-medium capitalize">{method().brand}</p>
											<p class="text-xs text-muted-foreground">
												•••• {method().last4} · expires {method().expires}
											</p>
										</div>
										<Badge variant="outline">Default</Badge>
									</div>
								)}
							</Show>
						</CardContent>
					</Card>
					<Show when={props.latestInvoice}>
						{(invoice) => <InvoiceCard invoice={invoice()} onDownload={props.onDownloadInvoice} />}
					</Show>
				</div>
			</div>
		</div>
	);
}
