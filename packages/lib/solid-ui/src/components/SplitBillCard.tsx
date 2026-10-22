/**
 * SplitBillCard - bill splitter: equal or custom per-person shares with paid state and settle-up summary.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import {
	chipVariants,
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface SplitPerson {
	name: string;
	/** Whether this person has already paid their share. */
	paid?: boolean;
}

export interface SplitBillCardProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Bill total in major units. */
	total: number;
	/** ISO 4217 currency code @default "USD" */
	currency?: string;
	people: SplitPerson[];
	/** `equal` divides the bill evenly; `custom` exposes per-person amount inputs. @default "equal" */
	mode?: "equal" | "custom";
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

export function SplitBillCard(props: SplitBillCardProps) {
	const [local, pass] = splitProps(props, ["total", "currency", "people", "mode", "locale"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "solidui-split-bill-card p-4",
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const fmt = (n: number) =>
		new Intl.NumberFormat(local.locale, { style: "currency", currency: local.currency ?? "USD" }).format(
			Number.isFinite(n) ? n : 0,
		);
	const people = () => local.people ?? [];
	const count = () => people().length;
	const share = () => (count() > 0 ? (local.total ?? 0) / count() : 0);
	const [customShares, setCustomShares] = createSignal<number[]>(people().map(() => share()));
	const amountFor = (i: number) => ((local.mode ?? "equal") === "custom" ? (customShares()[i] ?? 0) : share());
	const allocated = () => customShares().reduce((acc, v) => acc + (Number.isFinite(v) ? v : 0), 0);
	const paidCount = () => people().filter((p) => p.paid).length;
	const outstanding = () => people().reduce((acc, p, i) => acc + (p.paid ? 0 : amountFor(i)), 0);

	const setShare = (i: number, raw: string) => {
		const next = [...customShares()];
		next[i] = raw === "" ? Number.NaN : Number(raw);
		setCustomShares(next);
	};

	return (
		<article class={className()} {...rest}>
			<div class="flex items-baseline justify-between">
				<h3 class="text-sm font-semibold text-foreground">Split bill</h3>
				<p class="text-lg font-bold tabular-nums text-foreground">{fmt(local.total)}</p>
			</div>
			<ul class="mt-3 space-y-2">
				<For each={local.people}>
					{(person, i) => (
						<li class="flex items-center gap-3">
							<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-2xs font-semibold text-muted-foreground">
								{person.name.slice(0, 2).toUpperCase()}
							</span>
							<span class="min-w-0 flex-1 truncate text-sm text-foreground">{person.name}</span>
							<Show
								when={(local.mode ?? "equal") === "custom"}
								fallback={<span class="text-sm tabular-nums text-foreground">{fmt(share())}</span>}
							>
								<input
									type="number"
									aria-label={`Share for ${person.name}`}
									min={0}
									step="0.01"
									value={Number.isFinite(amountFor(i())) ? amountFor(i()) : ""}
									onInput={(e) => setShare(i(), e.currentTarget.value)}
									class="h-8 w-24 rounded-md border border-input bg-background px-2 text-sm tabular-nums text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								/>
							</Show>
							<span
								class={`shrink-0 rounded-full border px-2 py-0.5 text-2xs font-semibold ${person.paid ? chipVariants.success : chipVariants.warning}`}
							>
								{person.paid ? "Paid" : "Owes"}
							</span>
						</li>
					)}
				</For>
			</ul>
			<div class="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
				<Show
					when={(local.mode ?? "equal") === "custom"}
					fallback={
						<p>
							{fmt(share())} each — {paidCount()} of {count()} settled
							<Show when={outstanding() > 0}>
								<span class="tabular-nums"> · Outstanding {fmt(outstanding())}</span>
							</Show>
						</p>
					}
				>
					<p>
						Allocated <span class="tabular-nums">{fmt(allocated())}</span> of{" "}
						<span class="tabular-nums">{fmt(local.total)}</span>
						<Show when={allocated() < local.total}>
							<span class="tabular-nums"> — Remaining {fmt(local.total - allocated())}</span>
						</Show>
						<Show when={allocated() > local.total}>
							<span class="tabular-nums text-destructive"> — Over by {fmt(allocated() - local.total)}</span>
						</Show>
						<Show when={allocated() === local.total}>
							<span> — Fully allocated</span>
						</Show>
					</p>
				</Show>
			</div>
		</article>
	);
}
