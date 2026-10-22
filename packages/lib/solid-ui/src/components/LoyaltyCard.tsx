/**
 * LoyaltyCard — points balance, stamp grid (n/m filled), tier badge and next-reward hint.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface LoyaltyCardStamps {
	/** Stamps earned so far */
	earned: number;
	/** Stamps required for the next reward */
	required: number;
}

export interface LoyaltyCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Points balance */
	points?: number;
	/** Stamp progress */
	stamps?: LoyaltyCardStamps;
	/** Tier name shown as a badge (e.g. "Gold") */
	tier?: string;
	/** Points unit label @default "pts" */
	unit?: string;
}

export function LoyaltyCard(props: LoyaltyCardProps) {
	const [local, rest] = splitProps(props, ["class", "points", "stamps", "tier", "unit"]);
	const earned = () => Math.max(0, Math.min(local.stamps?.earned ?? 0, local.stamps?.required ?? 0));
	const left = () => Math.max(0, (local.stamps?.required ?? 0) - earned());
	const done = () => (local.stamps?.required ?? 0) > 0 && earned() >= (local.stamps?.required ?? 0);

	return (
		<div
			class={`solidui-loyalty-card w-56 rounded-lg border border-border bg-surface p-4 shadow-sm ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-start justify-between gap-2">
				<div>
					<p class="text-2xs font-medium uppercase tracking-wide text-muted-foreground">Points</p>
					<p class="mt-0.5 text-2xl font-bold tracking-tight tabular-nums text-foreground">
						{(local.points ?? 0).toLocaleString()}
						<span class="ml-1 text-xs font-normal text-muted-foreground">{local.unit ?? "pts"}</span>
					</p>
				</div>
				<Show when={local.tier}>
					<span class="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-2xs font-semibold text-primary">
						{local.tier}
					</span>
				</Show>
			</div>
			<div
				class="mt-3 flex flex-wrap gap-1.5"
				role="img"
				aria-label={`${earned()} of ${local.stamps?.required} stamps earned`}
			>
				<For each={Array.from({ length: Math.max(0, local.stamps?.required ?? 0) })}>
					{(_, i) => (
						<span
							aria-hidden="true"
							class={`flex h-6 w-6 items-center justify-center rounded-full border ${
								i() < earned()
									? "border-primary bg-primary text-primary-foreground"
									: "border-border bg-muted text-muted-foreground"
							}`}
						>
							<Show when={i() < earned()}>
								<svg
									class="h-3 w-3"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="m5 13 4 4L19 7" />
								</svg>
							</Show>
						</span>
					)}
				</For>
			</div>
			<p class="mt-2 text-2xs text-muted-foreground">
				{done()
					? "Reward unlocked — redeem at checkout"
					: `${left()} more stamp${left() === 1 ? "" : "s"} to your next reward`}
			</p>
		</div>
	);
}
