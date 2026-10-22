/**
 * TestResults — test suite summary (passed/failed/skipped + duration + per-suite rows).
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface TestSuite {
	name: string;
	passed: number;
	failed: number;
	/** Duration in ms. */
	duration?: number;
}

export interface TestResultsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	passed: number;
	failed: number;
	skipped?: number;
	/** Total duration ms. */
	duration?: number;
	/** Per-suite breakdown rows. */
	suites?: TestSuite[];
	title?: string;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

const fmtDur = (ms?: number) =>
	ms === undefined ? "" : ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;

export function TestResults(props: TestResultsProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"passed",
		"failed",
		"skipped",
		"duration",
		"suites",
		"title",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	const total = () => local.passed + local.failed + (local.skipped ?? 0);
	const ok = () => local.failed === 0;
	const chip = (count: number, label: string, cls: string) => (
		<Show when={count > 0}>
			<span class={`inline-flex items-center gap-1 font-mono font-medium ${cls}`}>
				{count} {label}
			</span>
		</Show>
	);
	return (
		<div
			class={`solidui-test-results ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex flex-wrap items-center gap-2">
				<svg
					class={`h-4 w-4 ${ok() ? "text-success" : "text-destructive"}`}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					{ok() ? (
						<path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
					) : (
						<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
					)}
				</svg>
				<span
					class={`font-semibold ${ok() ? "text-success" : "text-destructive"} ${local.size === "lg" ? "text-base" : "text-sm"}`}
				>
					{local.title ?? (ok() ? "All tests passed" : "Tests failed")}
				</span>
				<span class={`ml-auto flex items-center gap-3 ${textSize[local.size ?? "md"]}`}>
					{chip(local.passed, "passed", "text-success")}
					{chip(local.failed, "failed", "text-destructive")}
					{chip(local.skipped ?? 0, "skipped", "text-muted-foreground")}
					<Show when={local.duration !== undefined}>
						<span class="text-muted-foreground">{fmtDur(local.duration)}</span>
					</Show>
				</span>
			</div>
			<Show when={total()}>
				<div
					class="mt-2.5 flex h-1.5 overflow-hidden rounded-full bg-muted"
					role="img"
					aria-label={`${local.passed} passed, ${local.failed} failed, ${local.skipped ?? 0} skipped`}
				>
					<div class="bg-success" style={{ width: `${(local.passed / total()) * 100}%` }} />
					<div class="bg-destructive" style={{ width: `${(local.failed / total()) * 100}%` }} />
					<div class="bg-muted-foreground/40" style={{ width: `${((local.skipped ?? 0) / total()) * 100}%` }} />
				</div>
			</Show>
			<Show when={local.suites?.length}>
				<ul class="mt-2.5 space-y-1">
					<For each={local.suites}>
						{(s) => (
							<li class={`flex items-center gap-2 ${textSize[local.size ?? "md"]}`}>
								<span class={`h-1.5 w-1.5 rounded-full ${s.failed ? "bg-destructive" : "bg-success"}`} />
								<span class="min-w-0 flex-1 truncate font-mono text-foreground">{s.name}</span>
								<span class="text-muted-foreground">
									{s.passed}✓{s.failed ? ` ${s.failed}✗` : ""}
								</span>
								<Show when={s.duration !== undefined}>
									<span class="w-12 text-right tabular-nums text-muted-foreground">{fmtDur(s.duration)}</span>
								</Show>
							</li>
						)}
					</For>
				</ul>
			</Show>
		</div>
	);
}
