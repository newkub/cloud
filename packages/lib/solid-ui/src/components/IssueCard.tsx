/**
 * IssueCard — GitHub-style issue/PR row: state icon, title, labels, assignee, number.
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

export interface IssueLabel {
	name: string;
	/** Chip color class, e.g. "bg-destructive/15 text-destructive". */
	color?: string;
}

export interface IssueCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	number: number;
	title: string;
	/** Issue state. @default "open" */
	state?: "open" | "closed" | "merged" | "draft";
	labels?: IssueLabel[];
	assignee?: string;
	author?: string;
	/** Relative time text, e.g. "opened 2h ago". */
	time?: string;
	comments?: number;
	href?: string;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const stateIcon: Record<string, { cls: string; path: string }> = {
	open: { cls: "text-success", path: "M12 5v14M5 12h14" },
	closed: { cls: "text-info", path: "M6 6l12 12M18 6 6 18" },
	merged: { cls: "text-primary", path: "M7 4v13m0 0-3-3m3 3 3-3M7 17a3 3 0 1 0 0-6m10-4v10" },
	draft: { cls: "text-muted-foreground", path: "M12 8v4m0 4h.01" },
};

const pad = { sm: "p-2.5", md: "p-3", lg: "p-4" } as const;
const titleSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;

export function IssueCard(props: IssueCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"number",
		"title",
		"state",
		"labels",
		"assignee",
		"author",
		"time",
		"comments",
		"href",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const icon = () => stateIcon[local.state ?? "open"];
	return (
		<div
			class={`solidui-issue-card flex items-start gap-2.5 ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				class={`mt-0.5 h-4 w-4 shrink-0 ${icon().cls}`}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d={icon().path} stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			<div class="min-w-0 flex-1">
				<div class="flex flex-wrap items-center gap-1.5">
					{local.href ? (
						<a
							href={local.href}
							class={`font-semibold text-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${titleSize[local.size ?? "md"]}`}
						>
							{local.title}
						</a>
					) : (
						<span class={`font-semibold text-foreground ${titleSize[local.size ?? "md"]}`}>{local.title}</span>
					)}
					<span class={`font-mono text-muted-foreground ${local.size === "sm" ? "text-2xs" : "text-xs"}`}>
						#{local.number}
					</span>
					<For each={local.labels ?? []}>
						{(l) => (
							<span
								class={`rounded-full px-1.5 py-0.5 text-2xs font-medium ${l.color ?? "bg-muted text-muted-foreground"}`}
							>
								{l.name}
							</span>
						)}
					</For>
				</div>
				<div class="mt-1 flex flex-wrap items-center gap-3 text-2xs text-muted-foreground">
					<Show when={local.time}>
						<span>{local.time}</span>
					</Show>
					<Show when={local.author}>
						<span>by {local.author}</span>
					</Show>
					<Show when={local.assignee}>
						<span>→ {local.assignee}</span>
					</Show>
					<Show when={local.comments !== undefined}>
						<span class="tabular-nums">{local.comments} comments</span>
					</Show>
				</div>
			</div>
		</div>
	);
}
