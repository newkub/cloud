/**
 * CashflowStrip - paired income/expense mini bars per month with a signed net label.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, splitProps } from "solid-js";
import { type SurfaceVariant, surfaceVariants } from "../lib/variants";

export interface CashflowMonth {
	/** Short month label, e.g. "Jan". */
	label: string;
	/** Income in major units. */
	income: number;
	/** Expenses in major units. */
	expense: number;
}

export interface CashflowStripProps extends JSX.HTMLAttributes<HTMLDivElement> {
	months: CashflowMonth[];
	/** ISO 4217 currency code @default "USD" */
	currency?: string;
	/** BCP 47 locale — defaults to the runtime locale. */
	locale?: string;
	variant?: SurfaceVariant;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function CashflowStrip(props: CashflowStripProps) {
	const [local, pass] = splitProps(props, ["months", "currency", "locale"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "solidui-cashflow-strip p-4",
		variants: surfaceVariants,
		defaultVariant: "default",
	});

	const fmt = (n: number) =>
		new Intl.NumberFormat(local.locale, {
			style: "currency",
			currency: local.currency ?? "USD",
			maximumFractionDigits: 0,
		}).format(n);
	const signedFmt = (n: number) => (n > 0 ? `+${fmt(n)}` : n < 0 ? `-${fmt(-n)}` : fmt(0));
	const max = () => Math.max(1, ...local.months.flatMap((m) => [m.income, m.expense]));
	const net = (m: CashflowMonth) => m.income - m.expense;
	const netTone = (n: number) => (n > 0 ? "text-success" : n < 0 ? "text-destructive" : "text-muted-foreground");

	return (
		<div class={className()} {...rest}>
			{/* biome-ignore lint/a11y/useSemanticElements: list semantics need a div for flex layout */}
			<div class="flex items-end gap-3" role="list" aria-label="Monthly cash flow">
				<For each={local.months}>
					{(month) => (
						// biome-ignore lint/a11y/useSemanticElements: listitem role inside role=list container
						<div
							class="flex min-w-0 flex-1 flex-col items-center gap-1"
							role="listitem"
							aria-label={`${month.label}: income ${fmt(month.income)}, expense ${fmt(month.expense)}, net ${signedFmt(net(month))}`}
						>
							<div class="flex h-16 w-full items-end justify-center gap-1">
								<span
									class="w-2.5 rounded-sm bg-success"
									style={{ height: `${Math.max(4, (month.income / max()) * 100)}%` }}
									title={`Income ${fmt(month.income)}`}
								/>
								<span
									class="w-2.5 rounded-sm bg-destructive/70"
									style={{ height: `${Math.max(4, (month.expense / max()) * 100)}%` }}
									title={`Expense ${fmt(month.expense)}`}
								/>
							</div>
							<span class="truncate text-2xs text-muted-foreground">{month.label}</span>
							<span class={`text-2xs font-semibold tabular-nums ${netTone(net(month))}`}>{signedFmt(net(month))}</span>
						</div>
					)}
				</For>
			</div>
			<div class="mt-3 flex items-center gap-3 border-t border-border pt-2 text-2xs text-muted-foreground">
				<span class="flex items-center gap-1">
					<span class="h-2 w-2 rounded-sm bg-success" aria-hidden="true" /> Income
				</span>
				<span class="flex items-center gap-1">
					<span class="h-2 w-2 rounded-sm bg-destructive/70" aria-hidden="true" /> Expense
				</span>
			</div>
		</div>
	);
}
