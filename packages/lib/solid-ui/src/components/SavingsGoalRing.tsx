/**
 * SavingsGoalRing - circular progress ring toward a savings goal with remaining and deadline ETA text.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface SavingsGoalRingProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Target amount in major units. */
	goal: number;
	/** Amount saved so far in major units. */
	saved: number;
	/** ISO 4217 currency code @default "USD" */
	currency?: string;
	/** Goal deadline — Date, ISO string or epoch ms. */
	deadline?: Date | string | number;
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

const R = 52;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function SavingsGoalRing(props: SavingsGoalRingProps) {
	const [local, pass] = splitProps(props, ["goal", "saved", "currency", "deadline", "locale"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "solidui-savings-goal-ring flex items-center gap-4 p-4",
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const fmt = (n: number) =>
		new Intl.NumberFormat(local.locale, { style: "currency", currency: local.currency ?? "USD" }).format(n);
	const pct = () => (local.goal > 0 ? Math.min(1, Math.max(0, local.saved / local.goal)) : 1);
	const remaining = () => Math.max(0, local.goal - local.saved);
	const reached = () => local.saved >= local.goal && local.goal > 0;
	const daysLeft = () => {
		if (local.deadline === undefined) return undefined;
		return Math.ceil((new Date(local.deadline).getTime() - Date.now()) / 86400_000);
	};
	const etaText = () => {
		if (reached()) return "Goal reached";
		const days = daysLeft();
		if (days === undefined) return `${fmt(remaining())} to go — no deadline set`;
		if (days <= 0) return `${fmt(remaining())} to go — deadline passed`;
		return `${fmt(remaining())} to go — about ${fmt(remaining() / days)} per day for ${days} day${days === 1 ? "" : "s"}`;
	};

	return (
		<div class={className()} {...rest}>
			<div class="relative h-24 w-24 shrink-0">
				<svg
					viewBox="0 0 120 120"
					class="h-full w-full"
					role="progressbar"
					aria-label="Savings progress"
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={Math.round(pct() * 100)}
				>
					<circle
						cx="60"
						cy="60"
						r={R}
						fill="none"
						stroke="currentColor"
						stroke-width="10"
						class="text-muted-foreground/20"
					/>
					<circle
						cx="60"
						cy="60"
						r={R}
						fill="none"
						stroke="currentColor"
						stroke-width="10"
						stroke-linecap="round"
						stroke-dasharray={String(CIRCUMFERENCE)}
						stroke-dashoffset={String(CIRCUMFERENCE * (1 - pct()))}
						transform="rotate(-90 60 60)"
						class={`transition-[stroke-dashoffset] motion-reduce:transition-none ${reached() ? "text-success" : "text-primary"}`}
					/>
				</svg>
				<span class="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums text-foreground">
					{Math.round(pct() * 100)}%
				</span>
			</div>
			<div class="min-w-0">
				<p class="text-sm font-semibold tabular-nums text-foreground">
					{fmt(local.saved)} <span class="font-normal text-muted-foreground">of {fmt(local.goal)}</span>
				</p>
				<p class="mt-0.5 text-xs text-muted-foreground">{etaText()}</p>
			</div>
		</div>
	);
}
