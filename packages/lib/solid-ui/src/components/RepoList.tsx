/**
 * RepoList — repository rows: name, description, language dot, stars/forks and updated time.
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

export interface RepoListItem {
	/** Repo name, e.g. "wrikka/solid-ui". */
	name: string;
	/** Short description. */
	desc?: string;
	/** Primary language — controls the dot color. */
	lang?: string;
	/** Star count. */
	stars?: number;
	/** Fork count. */
	forks?: number;
	/** Relative update text, e.g. "2h ago". */
	updated?: string;
}

export interface RepoListProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Rows to render. */
	repos: RepoListItem[];
	/** Row click handler — turns rows into buttons. */
	onSelect?: (repo: RepoListItem) => void;
	/** Surface variant. @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. @default "lg" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const langDots: Record<string, string> = {
	typescript: "bg-info",
	javascript: "bg-warning",
	python: "bg-success",
	rust: "bg-destructive",
	go: "bg-primary",
	ruby: "bg-destructive",
	java: "bg-warning",
	css: "bg-primary",
	html: "bg-destructive",
	svelte: "bg-warning",
};

const dotCls = (lang?: string) => langDots[(lang ?? "").toLowerCase()] ?? "bg-muted";
const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));
const rowCls = "flex w-full items-center gap-3 px-3 py-2.5";

export function RepoList(props: RepoListProps) {
	const [local, rest] = splitProps(props, ["class", "repos", "onSelect", "variant", "radius", "elevation"]);
	const inner = (repo: RepoListItem) => (
		<>
			<div class="min-w-0 flex-1">
				<span class="block truncate text-sm font-medium text-foreground">{repo.name}</span>
				<Show when={repo.desc}>
					<span class="mt-0.5 block truncate text-xs text-muted-foreground">{repo.desc}</span>
				</Show>
			</div>
			<div class="flex shrink-0 items-center gap-3 text-2xs text-muted-foreground">
				<Show when={repo.lang}>
					<span class="flex items-center gap-1.5">
						<span class={`h-2.5 w-2.5 rounded-full ${dotCls(repo.lang)}`} />
						{repo.lang}
					</span>
				</Show>
				<Show when={repo.stars !== undefined}>
					<span class="flex items-center gap-1 tabular-nums" title="Stars">
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							aria-hidden="true"
						>
							<path
								d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z"
								stroke-linejoin="round"
							/>
						</svg>
						{fmt(repo.stars ?? 0)}
					</span>
				</Show>
				<Show when={repo.forks !== undefined}>
					<span class="flex items-center gap-1 tabular-nums" title="Forks">
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							aria-hidden="true"
						>
							<circle cx="6" cy="5" r="2.5" />
							<circle cx="18" cy="5" r="2.5" />
							<circle cx="12" cy="19" r="2.5" />
							<path d="M6 7.5V9a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7.5M12 12v4.5" />
						</svg>
						{fmt(repo.forks ?? 0)}
					</span>
				</Show>
				<Show when={repo.updated}>
					<span>{repo.updated}</span>
				</Show>
			</div>
		</>
	);
	return (
		<div
			class={`solidui-repo-list overflow-hidden border ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<ul class="divide-y divide-border">
				<For each={local.repos}>
					{(repo) => (
						<li>
							<Show when={local.onSelect} fallback={<div class={rowCls}>{inner(repo)}</div>}>
								<button
									type="button"
									class={`${rowCls} text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
									onClick={() => local.onSelect?.(repo)}
								>
									{inner(repo)}
								</button>
							</Show>
						</li>
					)}
				</For>
			</ul>
		</div>
	);
}
