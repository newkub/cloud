/**
 * ApprovalQueue - pending agent actions with per-item Approve/Deny buttons and a count badge.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import {
	chipVariants,
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export type ApprovalRisk = "low" | "medium" | "high";

export interface ApprovalItem {
	/** Stable id used for callbacks and decision tracking. */
	id: string;
	/** Action title. */
	title: string;
	/** Optional detail line. */
	detail?: string;
	/** Risk tier — controls the risk chip tone. */
	risk?: ApprovalRisk;
}

const SAMPLE_ITEMS: ApprovalItem[] = [
	{ id: "a1", title: "Write file src/report.md", detail: "Creates a new file (212 lines).", risk: "medium" },
	{ id: "a2", title: "Delete tmp/cache", detail: "Removes 38 cached files.", risk: "low" },
	{ id: "a3", title: "Run `git push --force`", detail: "Rewrites remote history.", risk: "high" },
];

const riskChip: Record<ApprovalRisk, string> = {
	low: chipVariants.success,
	medium: chipVariants.warning,
	high: chipVariants.destructive,
};

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "p-3 text-xs",
	md: "p-4 text-sm",
	lg: "p-6 text-base",
};

export interface ApprovalQueueProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Pending actions; falls back to sample data. */
	items?: ApprovalItem[];
	/** Called when an item is approved. */
	onApprove?: (item: ApprovalItem) => void;
	/** Called when an item is denied. */
	onDeny?: (item: ApprovalItem) => void;
	/** Card heading. @default "Pending approvals" */
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

export function ApprovalQueue(props: ApprovalQueueProps) {
	const [local, rest] = splitProps(props, ["items", "onApprove", "onDeny", "title", "children"]);
	const { className, rest: dom } = useComponentClasses(rest, {
		base: "solidui-approval-queue border",
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

	const items = () => local.items ?? SAMPLE_ITEMS;
	const [decisions, setDecisions] = createSignal<Record<string, "approved" | "denied">>({});
	const pending = () => items().filter((i) => !decisions()[i.id]).length;

	const decide = (item: ApprovalItem, decision: "approved" | "denied") => {
		setDecisions((d) => ({ ...d, [item.id]: decision }));
		if (decision === "approved") local.onApprove?.(item);
		else local.onDeny?.(item);
	};

	return (
		<div class={className()} {...dom}>
			<div class="mb-2 flex items-center gap-2">
				<NamedIcon name="shield" class="h-4 w-4 text-muted-foreground" aria-hidden="true" />
				<span class="font-semibold text-foreground">{local.title ?? "Pending approvals"}</span>
				<span class="ml-auto rounded-full border border-border bg-muted px-2 py-0.5 text-2xs font-semibold tabular-nums text-muted-foreground">
					{pending()} pending
				</span>
			</div>
			<Show
				when={items().length > 0}
				fallback={<p class="py-4 text-center text-muted-foreground">Nothing to review.</p>}
			>
				<ul class="m-0 list-none space-y-2 p-0">
					<For each={items()}>
						{(item) => {
							const decision = () => decisions()[item.id];
							return (
								<li class="rounded-md border border-border bg-surface px-3 py-2">
									<div class="flex items-center gap-2">
										<span class="min-w-0 flex-1 truncate font-medium text-foreground">{item.title}</span>
										<Show when={item.risk}>
											<span
												class={`rounded-full border px-2 py-0.5 text-2xs font-semibold capitalize ${riskChip[item.risk as ApprovalRisk]}`}
											>
												{item.risk} risk
											</span>
										</Show>
										<Show
											when={!decision()}
											fallback={
												<span
													class={`text-2xs font-semibold uppercase tracking-wide ${decision() === "approved" ? "text-success" : "text-destructive"}`}
												>
													{decision()}
												</span>
											}
										>
											<span class="flex shrink-0 gap-1.5">
												<button
													type="button"
													class="inline-flex h-7 items-center gap-1 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
													aria-label={`Approve ${item.title}`}
													onClick={() => decide(item, "approved")}
												>
													<NamedIcon name="check" class="h-3 w-3" aria-hidden="true" />
													Approve
												</button>
												<button
													type="button"
													class="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-transparent px-2.5 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
													aria-label={`Deny ${item.title}`}
													onClick={() => decide(item, "denied")}
												>
													<NamedIcon name="x" class="h-3 w-3" aria-hidden="true" />
													Deny
												</button>
											</span>
										</Show>
									</div>
									<Show when={item.detail}>
										<p class="mt-1 text-muted-foreground">{item.detail}</p>
									</Show>
								</li>
							);
						}}
					</For>
				</ul>
			</Show>
		</div>
	);
}
