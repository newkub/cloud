/**
 * RegionSelector - radio-style region list with latency bars and a "best" badge on the lowest latency.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface RegionOption {
	/** Region id, e.g. "us-east-1". */
	id: string;
	/** Display name, e.g. "US East". */
	name: string;
	/** Round-trip latency in ms — enables the latency bar. */
	latency?: number;
}

export interface RegionSelectorProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Regions to choose from. */
	regions: RegionOption[];
	/** Selected region id. */
	value?: string;
	/** Called with the picked region id. */
	onChange?: (id: string) => void;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const latencyTone = (ms: number) => (ms < 50 ? "bg-success" : ms < 150 ? "bg-warning" : "bg-destructive");

export function RegionSelector(props: RegionSelectorProps) {
	const [local, rest] = splitProps(props, ["class", "regions", "value", "onChange", "radius", "unstyled"]);

	const regions = () => local.regions ?? [];

	/** Lowest latency among regions that report one — earns the "best" badge. */
	const bestId = () => {
		const withLatency = regions().filter((r) => r.latency !== undefined);
		if (withLatency.length === 0) return undefined;
		return withLatency.reduce((a, b) => ((b.latency ?? 0) < (a.latency ?? 0) ? b : a)).id;
	};

	const maxLatency = () => Math.max(1, ...regions().map((r) => r.latency ?? 0));

	const className = () =>
		local.unstyled ? (local.class ?? "") : `solidui-region-selector flex flex-col gap-1 ${local.class ?? ""}`.trim();

	return (
		<div class={className()} role="radiogroup" {...rest}>
			<For each={regions()}>
				{(region) => {
					const selected = () => region.id === local.value;
					const barWidth = () => `${Math.max(4, ((region.latency ?? 0) / maxLatency()) * 100)}%`;
					return (
						// biome-ignore lint/a11y/useSemanticElements: radio pattern inside radiogroup
						<button
							type="button"
							role="radio"
							aria-checked={selected()}
							class={`flex w-full items-center gap-3 border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "md"]} ${
								selected() ? "border-primary bg-primary/5" : "border-border bg-surface hover:bg-accent/50"
							}`}
							onClick={() => local.onChange?.(region.id)}
						>
							<span
								class={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
									selected() ? "border-primary" : "border-muted-foreground"
								}`}
								aria-hidden="true"
							>
								<Show when={selected()}>
									<span class="h-2 w-2 rounded-full bg-primary" />
								</Show>
							</span>
							<span class="min-w-0 flex-1">
								<span class="flex items-center gap-2">
									<span class="truncate text-sm font-medium text-foreground">{region.name}</span>
									<Show when={region.id === bestId()}>
										<span class="inline-flex items-center gap-0.5 rounded-full border border-success/30 bg-success/10 px-1.5 py-0.5 text-2xs font-medium text-success">
											<NamedIcon name="zap" class="h-2.5 w-2.5" />
											best
										</span>
									</Show>
								</span>
								<span class="block font-mono text-2xs text-muted-foreground">{region.id}</span>
							</span>
							<Show when={region.latency !== undefined}>
								<span class="flex w-24 shrink-0 flex-col items-end gap-1">
									<span class="text-2xs tabular-nums text-muted-foreground">{region.latency}ms</span>
									<span class="h-1 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
										<span
											class={`block h-full rounded-full ${latencyTone(region.latency ?? 0)}`}
											style={{ width: barWidth() }}
										/>
									</span>
								</span>
							</Show>
						</button>
					);
				}}
			</For>
		</div>
	);
}
