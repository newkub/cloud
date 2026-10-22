/**
 * FunnelSteps — vertical funnel rows with stage value, width bar and drop-off between rows.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface FunnelStep {
	/** Stage name */
	label: string;
	/** Stage value */
	value: number;
}

export interface FunnelStepsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Funnel stages, widest first */
	steps: FunnelStep[];
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function FunnelSteps(props: FunnelStepsProps) {
	const [local, rest] = splitProps(props, ["class", "children", "steps", "radius", "elevation"]);

	const top = () => Math.max(1, ...(local.steps ?? []).map((s) => s.value));
	const pct = (v: number) => Math.min(100, Math.max(0, (v / top()) * 100));
	const drop = (i: number) => {
		const steps = local.steps ?? [];
		const prev = steps[i - 1]?.value ?? 0;
		const cur = steps[i]?.value ?? 0;
		return prev > 0 ? ((prev - cur) / prev) * 100 : 0;
	};

	return (
		<div
			class={[
				"solidui-funnel-steps flex w-full flex-col gap-1",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<For each={local.steps ?? []}>
				{(step, i) => (
					<>
						<Show when={i() > 0}>
							<div class="flex items-center gap-2 pl-2 text-2xs text-muted-foreground">
								<svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
									<path d="M4 7 L7 3 L1 3 Z" fill="currentColor" class="text-warning" />
								</svg>
								<span class="tabular-nums">-{drop(i()).toFixed(1)}%</span>
							</div>
						</Show>
						<div class="flex items-baseline justify-between gap-2">
							<span class="truncate text-xs text-foreground">{step.label}</span>
							<span class="text-xs font-medium text-foreground tabular-nums">{step.value.toLocaleString()}</span>
						</div>
						<div class="h-2 w-full rounded-sm bg-muted" role="presentation">
							<div class="h-full rounded-sm bg-primary" style={{ width: `${pct(step.value).toFixed(1)}%` }} />
						</div>
					</>
				)}
			</For>
			{local.children}
		</div>
	);
}
