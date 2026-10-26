import { createSignal, For, Show, type JSX } from "solid-js";
import { Badge } from "../components/Badge";
import { ChartCard } from "../components/ChartCard";
import { Divider } from "../components/Divider";
import { LineChart, type LineSeries } from "../components/LineChart";
import { MetricCard } from "../components/MetricCard";
import { Tabs, TabsList, TabsTrigger } from "../components/Tabs";

export interface DashboardMetric {
	label: string;
	value: string | number;
	delta?: number;
	deltaSuffix?: string;
	hint?: string;
}

export interface DashboardSeries {
	/** Range label, one tab per entry. */
	range: string;
	labels: string[];
	series: LineSeries[];
}

export interface TopRow {
	label: string;
	value: string;
	/** Relative weight 0–100 driving the bar width. */
	share: number;
}

export interface MetricsDashboardBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title?: string;
	description?: string;
	metrics: DashboardMetric[];
	series: DashboardSeries[];
	topPages?: TopRow[];
	topSources?: TopRow[];
}

/** A dense analytics view: KPI cards, one inspectable chart, and ranked lists. */
export function MetricsDashboardBlock(props: MetricsDashboardBlockProps) {
	const [range, setRange] = createSignal(props.series[0]?.range ?? "");
	const active = () => props.series.find((item) => item.range === range()) ?? props.series[0];

	return (
		<div class={`flex flex-col gap-6 ${props.class ?? ""}`}>
			<div class="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h2 class="text-xl font-semibold tracking-tight">{props.title ?? "Overview"}</h2>
					<Show when={props.description}>
						<p class="text-sm text-muted-foreground">{props.description}</p>
					</Show>
				</div>
				<Badge variant="success">Live</Badge>
			</div>

			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<For each={props.metrics}>
					{(metric) => (
						<MetricCard
							label={metric.label}
							value={metric.value}
							delta={metric.delta}
							deltaSuffix={metric.deltaSuffix}
							hint={metric.hint}
						/>
					)}
				</For>
			</div>

			<ChartCard
				title="Traffic"
				description="Requests served across all regions"
				actions={
					<Tabs value={range()} onValueChange={(value) => setRange(value)}>
						<TabsList variant="pills">
							<For each={props.series}>{(item) => <TabsTrigger value={item.range}>{item.range}</TabsTrigger>}</For>
						</TabsList>
					</Tabs>
				}
				legend={
					<div class="flex flex-wrap gap-4">
						<For each={active()?.series ?? []}>
							{(item) => (
								<span class="flex items-center gap-1.5 text-xs text-muted-foreground">
									<span class="h-2 w-2 rounded-full" style={{ background: item.color ?? "var(--primary)" }} />
									{item.name}
								</span>
							)}
						</For>
					</div>
				}
			>
				<Show when={active()}>
					{(current) => (
						<LineChart
							series={current().series}
							labels={current().labels}
							width={720}
							height={240}
							showDots={false}
						/>
					)}
				</Show>
			</ChartCard>

			<div class="grid gap-4 lg:grid-cols-2">
				<For each={[{ title: "Top pages", rows: props.topPages }, { title: "Top sources", rows: props.topSources }]}>
					{(group) => (
						<Show when={group.rows?.length}>
							<div class="rounded-lg border border-border bg-card p-4">
								<h3 class="mb-3 text-sm font-semibold">{group.title}</h3>
								<div class="flex flex-col gap-3">
									<For each={group.rows}>
										{(row, index) => (
											<>
												<Show when={index() > 0}>
													<Divider />
												</Show>
												<div class="flex flex-col gap-1">
													<div class="flex items-center justify-between text-sm">
														<span class="truncate font-medium">{row.label}</span>
														<span class="text-muted-foreground">{row.value}</span>
													</div>
													<div class="h-1.5 overflow-hidden rounded-full bg-muted">
														<div
															class="h-full rounded-full bg-primary"
															style={{ width: `${Math.max(0, Math.min(100, row.share))}%` }}
														/>
													</div>
												</div>
											</>
										)}
									</For>
								</div>
							</div>
						</Show>
					)}
				</For>
			</div>
		</div>
	);
}
