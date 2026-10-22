/**
 * ChangelogList — version history timeline with change-type badges.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export type ChangeKind = "added" | "changed" | "fixed" | "removed" | "breaking" | "security";

export interface ChangelogEntry {
	kind: ChangeKind;
	text: string;
}

export interface ChangelogVersion {
	version: string;
	date?: string;
	/** Mark the current/latest release. */
	latest?: boolean;
	entries: ChangelogEntry[];
}

export interface ChangelogListProps extends JSX.HTMLAttributes<HTMLDivElement> {
	versions: ChangelogVersion[];
	/** Cap how many versions render. */
	limit?: number;
	size?: "sm" | "md" | "lg";
	/** Corner radius on badges. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const kindCls: Record<ChangeKind, string> = {
	added: "bg-success/15 text-success",
	changed: "bg-info/15 text-info",
	fixed: "bg-primary/15 text-primary",
	removed: "bg-muted text-muted-foreground",
	breaking: "bg-destructive/15 text-destructive",
	security: "bg-warning/15 text-warning",
};

const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function ChangelogList(props: ChangelogListProps) {
	const [local, rest] = splitProps(props, ["class", "versions", "limit", "size", "radius", "elevation"]);
	const versions = () => (local.limit ? (local.versions ?? []).slice(0, local.limit) : (local.versions ?? []));
	return (
		<div
			class={`solidui-changelog-list space-y-6 ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={versions()}>
				{(v) => (
					<section>
						<header class="flex items-baseline gap-2">
							<span class={`font-mono font-semibold text-foreground ${local.size === "lg" ? "text-base" : "text-sm"}`}>
								v{v.version}
							</span>
							<Show when={v.latest}>
								<span class="rounded-full bg-primary/15 px-1.5 py-0.5 text-2xs font-medium text-primary">latest</span>
							</Show>
							<Show when={v.date}>
								<span class="text-2xs tabular-nums text-muted-foreground">{v.date}</span>
							</Show>
						</header>
						<ul class={`mt-2 space-y-1.5 border-l-2 border-border pl-4 ${textSize[local.size ?? "md"]}`}>
							<For each={v.entries}>
								{(e) => (
									<li class="flex items-start gap-2">
										<span
											class={`mt-0.5 shrink-0 rounded px-1.5 text-2xs font-medium ${kindCls[e.kind]} ${radiusMap[local.radius ?? "sm"]}`}
										>
											{e.kind}
										</span>
										<span class="text-foreground/90">{e.text}</span>
									</li>
								)}
							</For>
						</ul>
					</section>
				)}
			</For>
		</div>
	);
}
