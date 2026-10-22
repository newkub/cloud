/**
 * EvalScorecard - per-eval pass-rate bars with counts, optional score and an empty state.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface EvalRun {
	/** Eval suite name. */
	name: string;
	/** Passing cases. */
	passed: number;
	/** Total cases. */
	total: number;
	/** Optional quality score 0–1 shown as a percent badge. */
	score?: number;
}

const SAMPLE_RUNS: EvalRun[] = [
	{ name: "retrieval-accuracy", passed: 46, total: 50, score: 0.92 },
	{ name: "tool-selection", passed: 18, total: 20, score: 0.9 },
	{ name: "refusal-behavior", passed: 9, total: 12 },
];

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "p-3 text-xs",
	md: "p-4 text-sm",
	lg: "p-6 text-base",
};

export interface EvalScorecardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Eval runs; falls back to sample data. An empty array shows the empty state. */
	runs?: EvalRun[];
	/** Card heading. @default "Eval results" */
	title?: string;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function EvalScorecard(props: EvalScorecardProps) {
	const [local, rest] = splitProps(props, ["runs", "title", "children"]);
	const { className, rest: dom } = useComponentClasses(rest, {
		base: "solidui-eval-scorecard border",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		sizes: sizeMap,
		defaultVariant: "default",
		defaultSize: "md",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});

	const runs = () => local.runs ?? SAMPLE_RUNS;
	const totals = () =>
		runs().reduce((acc, r) => ({ passed: acc.passed + r.passed, total: acc.total + r.total }), { passed: 0, total: 0 });
	const passRate = (r: EvalRun) => (r.total > 0 ? r.passed / r.total : 0);

	return (
		<div class={className()} {...dom}>
			<div class="mb-3 flex items-center gap-2">
				<span class="font-semibold text-foreground">{local.title ?? "Eval results"}</span>
				<Show when={runs().length > 0}>
					<span class="ml-auto rounded-full border border-border bg-muted px-2 py-0.5 text-2xs font-semibold tabular-nums text-muted-foreground">
						{totals().passed}/{totals().total} passed
					</span>
				</Show>
			</div>
			<Show when={runs().length > 0} fallback={<p class="py-4 text-center text-muted-foreground">No eval runs yet.</p>}>
				<ul class="m-0 list-none space-y-3 p-0">
					<For each={runs()}>
						{(run) => (
							<li>
								<div class="mb-1 flex items-baseline gap-2">
									<span class="min-w-0 flex-1 truncate font-medium text-foreground">{run.name}</span>
									<Show when={run.score !== undefined}>
										<span class="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-2xs font-semibold tabular-nums text-primary">
											{Math.round((run.score ?? 0) * 100)}%
										</span>
									</Show>
									<span class="text-2xs tabular-nums text-muted-foreground">
										{run.passed}/{run.total}
									</span>
								</div>
								{/* biome-ignore lint/a11y/useSemanticElements: APG meter role requires aria-valuenow on a generic element */}
								<div
									class="h-1.5 overflow-hidden rounded-full bg-muted"
									role="meter"
									aria-valuenow={run.passed}
									aria-valuemin={0}
									aria-valuemax={run.total}
									aria-label={`${run.name} pass rate`}
								>
									<div
										class="h-full rounded-full bg-success transition-[width] motion-reduce:transition-none"
										style={{ width: `${Math.round(passRate(run) * 100)}%` }}
									/>
								</div>
							</li>
						)}
					</For>
				</ul>
			</Show>
		</div>
	);
}
