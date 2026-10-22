/**
 * ToolCallCard - one agent tool call with collapsible args/result and a duration badge.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import {
	type ChipVariant,
	chipVariants,
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export type ToolCallStatus = "pending" | "running" | "done" | "error";

const statusChip: Record<ToolCallStatus, ChipVariant> = {
	pending: "default",
	running: "primary",
	done: "success",
	error: "destructive",
};

const statusLabel: Record<ToolCallStatus, string> = {
	pending: "Pending",
	running: "Running",
	done: "Done",
	error: "Failed",
};

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "text-xs",
	md: "text-sm",
	lg: "text-base",
};

const SAMPLE = {
	name: "read_file",
	args: { path: "src/components/Badge.tsx", offset: 0, limit: 200 },
	result: { lines: 47, truncated: false },
	durationMs: 842,
	status: "done" as ToolCallStatus,
};

function formatValue(v: unknown): string {
	if (typeof v === "string") return v;
	try {
		return JSON.stringify(v, null, 2) ?? String(v);
	} catch {
		return String(v);
	}
}

function formatMs(ms: number): string {
	return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}

export interface ToolCallCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Tool name. @default "read_file" */
	name?: string;
	/** Call arguments — rendered as formatted JSON in a collapsible block. */
	args?: unknown;
	/** Call result — rendered as formatted JSON in a collapsible block. */
	result?: unknown;
	/** Wall-clock duration in milliseconds. */
	durationMs?: number;
	/** Call status. @default "done" */
	status?: ToolCallStatus;
	/** Start with args/result expanded. @default false */
	defaultOpen?: boolean;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function ToolCallCard(props: ToolCallCardProps) {
	const [local, rest] = splitProps(props, [
		"name",
		"args",
		"result",
		"durationMs",
		"status",
		"defaultOpen",
		"children",
	]);
	const { className, rest: dom } = useComponentClasses(rest, {
		base: "solidui-tool-call-card overflow-hidden border",
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

	const [open, setOpen] = createSignal(local.defaultOpen ?? false);
	/** When no call data is passed at all, render the bundled sample call. */
	const isSample = () =>
		local.name === undefined &&
		local.args === undefined &&
		local.result === undefined &&
		local.durationMs === undefined &&
		local.status === undefined;
	const name = () => (isSample() ? SAMPLE.name : (local.name ?? "tool_call"));
	const args = () => (isSample() ? SAMPLE.args : local.args);
	const result = () => (isSample() ? SAMPLE.result : local.result);
	const durationMs = () => (isSample() ? SAMPLE.durationMs : local.durationMs);
	const status = () => (isSample() ? SAMPLE.status : (local.status ?? "done"));
	const hasDetails = () => args() !== undefined || result() !== undefined;

	return (
		<div class={className()} {...dom}>
			<div class="flex items-center gap-2 px-3 py-2">
				<NamedIcon name="zap" class="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
				<span class="min-w-0 flex-1 truncate font-mono font-medium text-foreground">{name()}</span>
				<Show when={durationMs() !== undefined}>
					<span class="rounded-full border border-border bg-muted px-2 py-0.5 text-2xs tabular-nums text-muted-foreground">
						{formatMs(durationMs() as number)}
					</span>
				</Show>
				<span
					class={`inline-flex items-center rounded-full border px-2 py-0.5 text-2xs font-semibold ${chipVariants[statusChip[status()]]}`}
				>
					{statusLabel[status()]}
				</span>
				<Show when={hasDetails()}>
					<button
						type="button"
						class="grid h-6 w-6 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						aria-expanded={open()}
						aria-label="Toggle tool call details"
						onClick={() => setOpen((v) => !v)}
					>
						<NamedIcon
							name="chevron-down"
							class={`h-3.5 w-3.5 transition-transform motion-reduce:transition-none ${open() ? "rotate-180" : ""}`}
						/>
					</button>
				</Show>
			</div>
			<Show when={open() && hasDetails()}>
				<div class="space-y-2 border-t border-border px-3 py-2">
					<Show when={args() !== undefined}>
						<div>
							<p class="mb-1 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Arguments</p>
							<pre class="max-h-48 overflow-auto rounded-md bg-muted p-2 font-mono text-xs text-foreground">
								{formatValue(args())}
							</pre>
						</div>
					</Show>
					<Show when={result() !== undefined}>
						<div>
							<p class="mb-1 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">Result</p>
							<pre class="max-h-48 overflow-auto rounded-md bg-muted p-2 font-mono text-xs text-foreground">
								{formatValue(result())}
							</pre>
						</div>
					</Show>
				</div>
			</Show>
		</div>
	);
}
