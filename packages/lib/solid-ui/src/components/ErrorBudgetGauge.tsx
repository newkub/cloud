/**
 * ErrorBudgetGauge — remaining error-budget ring with burn-rate hint and tone by remaining share.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";

export interface ErrorBudgetGaugeProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "size"> {
	/** Total budget (e.g. allowed bad events or minutes). */
	total: number;
	/** Budget already consumed. */
	consumed: number;
	/** Ring diameter in px @default 96 */
	size?: number;
	/** Stroke thickness in px @default 8 */
	thickness?: number;
	/** Caption under the ring @default "Error budget" */
	label?: string;
	/** Remaining fraction at which the ring stays success @default 0.5 */
	successAt?: number;
	/** Remaining fraction at which the ring stays warning @default 0.2 */
	warnAt?: number;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const strokeColor = {
	success: "text-success",
	warning: "text-warning",
	destructive: "text-destructive",
} as const;

const fmt = (n: number) => (Number.isFinite(n) ? n.toLocaleString("en-US") : "0");

export function ErrorBudgetGauge(props: ErrorBudgetGaugeProps) {
	// `size` is a numeric dimension here, not the density axis — split it (and the
	// data props) off before handing the rest to useComponentClasses.
	const [local, helperProps] = splitProps(props, [
		"total",
		"consumed",
		"size",
		"thickness",
		"label",
		"successAt",
		"warnAt",
		"children",
	]);
	const { className, rest: dom } = useComponentClasses(helperProps, {
		base: "solidui-error-budget-gauge inline-flex flex-col items-center gap-1.5",
		unstyled: props.unstyled,
	});
	const size = () => local.size ?? 96;
	const thickness = () => local.thickness ?? 8;
	const remainingFrac = () =>
		local.total > 0 ? Math.min(1, Math.max(0, (local.total - local.consumed) / local.total)) : 0;
	const burnFrac = () => (local.total > 0 ? Math.min(1, Math.max(0, local.consumed / local.total)) : 0);
	const pct = () => Math.round(remainingFrac() * 100);
	const tone = (): keyof typeof strokeColor =>
		remainingFrac() >= (local.successAt ?? 0.5)
			? "success"
			: remainingFrac() >= (local.warnAt ?? 0.2)
				? "warning"
				: "destructive";
	const radius = () => (size() - thickness()) / 2;
	const circumference = () => 2 * Math.PI * radius();
	const dashOffset = () => circumference() - remainingFrac() * circumference();
	const ariaLabel = () => `Error budget ${pct()}% remaining, ${Math.round(burnFrac() * 100)}% consumed`;

	return (
		<div class={className()} {...dom}>
			<div class="relative inline-flex items-center justify-center">
				<svg
					role="img"
					aria-label={ariaLabel()}
					width={size()}
					height={size()}
					viewBox={`0 0 ${size()} ${size()}`}
					fill="none"
				>
					<title>{ariaLabel()}</title>
					<circle
						cx={size() / 2}
						cy={size() / 2}
						r={radius()}
						class="text-muted"
						stroke="currentColor"
						stroke-width={thickness()}
						fill="none"
					/>
					<circle
						cx={size() / 2}
						cy={size() / 2}
						r={radius()}
						class={`${strokeColor[tone()]} transition-[stroke-dashoffset] motion-reduce:transition-none`}
						stroke="currentColor"
						stroke-width={thickness()}
						stroke-linecap="round"
						stroke-dasharray={String(circumference())}
						stroke-dashoffset={dashOffset()}
						transform={`rotate(-90 ${size() / 2} ${size() / 2})`}
						fill="none"
					/>
				</svg>
				<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
					<span class="font-bold tabular-nums text-foreground" style={{ "font-size": `${size() / 4}px` }}>
						{pct()}%
					</span>
					<span class="font-medium text-muted-foreground" style={{ "font-size": `${Math.max(9, size() / 9)}px` }}>
						left
					</span>
				</div>
			</div>
			<div class="text-center text-xs tabular-nums text-muted-foreground">
				<span class={tone() === "destructive" ? "font-semibold text-destructive" : ""}>
					{fmt(Math.max(0, local.total - local.consumed))}
				</span>
				{" / "}
				{fmt(local.total)} remaining · burn {Math.round(burnFrac() * 100)}%
			</div>
			<Show when={local.label !== null}>
				<span class="text-xs font-medium text-muted-foreground">{local.label ?? "Error budget"}</span>
			</Show>
			{local.children}
		</div>
	);
}
