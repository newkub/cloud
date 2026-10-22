/**
 * RefundCard - refund status card: amount, status stepper and expected settlement date.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	chipVariants,
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export type RefundStatus = "requested" | "processing" | "refunded" | "rejected";

const STEPS: { key: Exclude<RefundStatus, "rejected">; label: string }[] = [
	{ key: "requested", label: "Requested" },
	{ key: "processing", label: "Processing" },
	{ key: "refunded", label: "Refunded" },
];

export interface RefundCardProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Related order identifier, e.g. "#1042". */
	orderId?: string;
	/** Refund amount in major units. */
	amount: number;
	status: RefundStatus;
	/** Expected settlement date — Date, ISO string or epoch ms. */
	expectedAt?: Date | string | number;
	/** ISO 4217 currency code @default "USD" */
	currency?: string;
	/** BCP 47 locale — defaults to the runtime locale. */
	locale?: string;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function RefundCard(props: RefundCardProps) {
	const [local, pass] = splitProps(props, ["orderId", "amount", "status", "expectedAt", "currency", "locale"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "solidui-refund-card p-4",
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const fmt = (n: number) =>
		new Intl.NumberFormat(local.locale, { style: "currency", currency: local.currency ?? "USD" }).format(n);
	const dateFmt = () => new Intl.DateTimeFormat(local.locale, { month: "short", day: "numeric", year: "numeric" });
	const activeIndex = () => STEPS.findIndex((s) => s.key === local.status);
	const rejected = () => local.status === "rejected";

	return (
		<article class={className()} {...rest}>
			<div class="flex items-baseline justify-between gap-2">
				<h3 class="truncate text-sm font-semibold text-foreground">
					Refund{local.orderId ? ` · ${local.orderId}` : ""}
				</h3>
				<p class="text-lg font-bold tabular-nums text-foreground">{fmt(local.amount)}</p>
			</div>
			<Show
				when={!rejected()}
				fallback={
					<p
						role="status"
						class={`mt-3 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${chipVariants.destructive}`}
					>
						Refund rejected
					</p>
				}
			>
				<ol class="mt-3 flex items-center" aria-label="Refund progress">
					<For each={STEPS}>
						{(step, i) => {
							const state = () => (i() < activeIndex() ? "done" : i() === activeIndex() ? "current" : "todo");
							return (
								<li class={`flex items-center ${i() < STEPS.length - 1 ? "flex-1" : ""}`}>
									<span
										class={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-2xs font-semibold ${
											state() === "done"
												? "border-success bg-success text-success-foreground"
												: state() === "current"
													? "border-primary bg-primary text-primary-foreground"
													: "border-border bg-muted text-muted-foreground"
										}`}
										aria-hidden="true"
									>
										{state() === "done" ? "✓" : i() + 1}
									</span>
									<span
										class={`ml-1.5 text-xs ${state() === "todo" ? "text-muted-foreground" : "font-medium text-foreground"}`}
										aria-current={state() === "current" ? "step" : undefined}
									>
										{step.label}
									</span>
									<Show when={i() < STEPS.length - 1}>
										<span
											class={`mx-2 h-px flex-1 ${i() < activeIndex() ? "bg-success" : "bg-border"}`}
											aria-hidden="true"
										/>
									</Show>
								</li>
							);
						}}
					</For>
				</ol>
			</Show>
			<Show when={local.expectedAt !== undefined && !rejected() && local.status !== "refunded"}>
				<p class="mt-2 text-xs text-muted-foreground">
					Expected by <time class="tabular-nums">{dateFmt().format(new Date(local.expectedAt ?? 0))}</time>
				</p>
			</Show>
			<Show when={local.status === "refunded"}>
				<p class="mt-2 text-xs font-medium text-success">Refunded to your original payment method.</p>
			</Show>
		</article>
	);
}
