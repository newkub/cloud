/**
 * DiffReviewCard - file diff viewer with per-hunk Accept/Reject review actions.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface DiffLine {
	/** Line kind: added, deleted or context. */
	type: "add" | "del" | "ctx";
	/** Line text (without the leading +/-/space marker). */
	text: string;
}

export interface DiffHunk {
	/** Hunk header, e.g. "@@ -1,4 +1,5 @@". */
	header: string;
	/** Hunk lines. */
	lines: DiffLine[];
}

export interface DiffFile {
	/** File path shown in the header. */
	file: string;
	/** Diff hunks. */
	hunks: DiffHunk[];
}

const SAMPLE_DIFF: DiffFile = {
	file: "src/components/Badge.tsx",
	hunks: [
		{
			header: "@@ -1,4 +1,5 @@",
			lines: [
				{ type: "ctx", text: 'import { useComponentClasses } from "@wrikka/hooks";' },
				{ type: "del", text: "const sizeMap = { sm: 'px-1' }" },
				{ type: "add", text: "const sizeMap = { sm: 'px-2 py-0.5', md: 'px-2.5' }" },
				{ type: "ctx", text: "export interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {" },
			],
		},
		{
			header: "@@ -20,3 +21,4 @@",
			lines: [
				{ type: "ctx", text: "return (" },
				{ type: "add", text: "<span class={className()} {...rest}>" },
				{ type: "del", text: "<span {...rest}>" },
			],
		},
	],
};

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "text-2xs",
	md: "text-xs",
	lg: "text-sm",
};

const lineStyle: Record<DiffLine["type"], string> = {
	add: "bg-success/10",
	del: "bg-destructive/10",
	ctx: "",
};

const signStyle: Record<DiffLine["type"], string> = {
	add: "text-success",
	del: "text-destructive",
	ctx: "text-muted-foreground",
};

const sign: Record<DiffLine["type"], string> = { add: "+", del: "-", ctx: " " };

export interface DiffReviewCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** File diff; falls back to sample data. */
	diff?: DiffFile;
	/** Called with the hunk index when accepted. */
	onAccept?: (hunkIndex: number, hunk: DiffHunk) => void;
	/** Called with the hunk index when rejected. */
	onReject?: (hunkIndex: number, hunk: DiffHunk) => void;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function DiffReviewCard(props: DiffReviewCardProps) {
	const [local, rest] = splitProps(props, ["diff", "onAccept", "onReject", "children"]);
	const { className, rest: dom } = useComponentClasses(rest, {
		base: "solidui-diff-review-card overflow-hidden border",
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

	const diff = () => local.diff ?? SAMPLE_DIFF;
	const [decisions, setDecisions] = createSignal<Record<number, "accepted" | "rejected">>({});
	const adds = () => diff().hunks.reduce((n, h) => n + h.lines.filter((l) => l.type === "add").length, 0);
	const dels = () => diff().hunks.reduce((n, h) => n + h.lines.filter((l) => l.type === "del").length, 0);

	const decide = (index: number, hunk: DiffHunk, decision: "accepted" | "rejected") => {
		setDecisions((d) => ({ ...d, [index]: decision }));
		if (decision === "accepted") local.onAccept?.(index, hunk);
		else local.onReject?.(index, hunk);
	};

	return (
		<div class={className()} {...dom}>
			<div class="flex items-center gap-2 border-b border-border px-3 py-2">
				<NamedIcon name="file" class="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
				<span class="min-w-0 flex-1 truncate font-mono font-medium text-foreground">{diff().file}</span>
				<span class="tabular-nums text-success">+{adds()}</span>
				<span class="tabular-nums text-destructive">-{dels()}</span>
			</div>
			<Show when={diff().hunks.length > 0} fallback={<p class="py-4 text-center text-muted-foreground">No changes.</p>}>
				<For each={diff().hunks}>
					{(hunk, i) => {
						const decision = () => decisions()[i()];
						return (
							<div class="border-b border-border last:border-b-0">
								<div class="flex items-center gap-2 bg-muted/60 px-3 py-1.5">
									<code class="min-w-0 flex-1 truncate font-mono text-muted-foreground">{hunk.header}</code>
									<Show
										when={!decision()}
										fallback={
											<span
												class={`text-2xs font-semibold uppercase tracking-wide ${decision() === "accepted" ? "text-success" : "text-destructive"}`}
											>
												{decision()}
											</span>
										}
									>
										<span class="flex shrink-0 gap-1.5">
											<button
												type="button"
												class="inline-flex h-6 items-center gap-1 rounded border border-success/30 bg-success/10 px-2 text-2xs font-medium text-success hover:bg-success/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
												aria-label={`Accept hunk ${i() + 1}`}
												onClick={() => decide(i(), hunk, "accepted")}
											>
												Accept
											</button>
											<button
												type="button"
												class="inline-flex h-6 items-center gap-1 rounded border border-destructive/30 bg-destructive/10 px-2 text-2xs font-medium text-destructive hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
												aria-label={`Reject hunk ${i() + 1}`}
												onClick={() => decide(i(), hunk, "rejected")}
											>
												Reject
											</button>
										</span>
									</Show>
								</div>
								<pre class="m-0 overflow-x-auto px-0 py-1 font-mono">
									<For each={hunk.lines}>
										{(line) => (
											<div class={`flex px-3 leading-5 ${lineStyle[line.type]}`}>
												<span class={`w-4 shrink-0 select-none ${signStyle[line.type]}`} aria-hidden="true">
													{sign[line.type]}
												</span>
												<span class="whitespace-pre text-foreground">{line.text}</span>
											</div>
										)}
									</For>
								</pre>
							</div>
						);
					}}
				</For>
			</Show>
		</div>
	);
}
