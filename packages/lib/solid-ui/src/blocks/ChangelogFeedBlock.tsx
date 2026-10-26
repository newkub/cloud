import { createMemo, createSignal, For, Show, type JSX } from "solid-js";
import { Badge } from "../components/Badge";
import { ChangelogList, type ChangeKind, type ChangelogVersion } from "../components/ChangelogList";
import { EmptyState } from "../components/EmptyState";
import { Tabs, TabsList, TabsTrigger } from "../components/Tabs";

export type ChangelogFilter = "all" | ChangeKind;

export interface ChangelogFeedBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title?: string;
	description?: string;
	versions: ChangelogVersion[];
	/** Kinds offered as filters @default ["added","changed","fixed"] */
	filters?: ChangeKind[];
	/** Cap how many versions render. */
	limit?: number;
}

/** Release notes you can filter by change kind. */
export function ChangelogFeedBlock(props: ChangelogFeedBlockProps) {
	const [filter, setFilter] = createSignal<ChangelogFilter>("all");
	const filters = () => props.filters ?? (["added", "changed", "fixed"] as ChangeKind[]);

	const versions = createMemo<ChangelogVersion[]>(() => {
		const active = filter();
		if (active === "all") return props.versions;
		return props.versions
			.map((version) => ({
				...version,
				entries: version.entries.filter((entry) => entry.kind === active),
			}))
			.filter((version) => version.entries.length > 0);
	});

	return (
		<div class={`flex flex-col gap-6 ${props.class ?? ""}`}>
			<div class="flex flex-col gap-3">
				<Show when={props.title}>
					<h2 class="text-2xl font-semibold tracking-tight">{props.title}</h2>
				</Show>
				<Show when={props.description}>
					<p class="max-w-2xl text-sm text-muted-foreground">{props.description}</p>
				</Show>
				<Tabs
					value={filter()}
					onValueChange={(value) => setFilter(value as ChangelogFilter)}
				>
					<TabsList variant="pills">
						<TabsTrigger value="all">All changes</TabsTrigger>
						<For each={filters()}>
							{(kind) => (
								<TabsTrigger value={kind}>{kind[0]?.toUpperCase() + kind.slice(1)}</TabsTrigger>
							)}
						</For>
					</TabsList>
				</Tabs>
			</div>
			<Show
				when={versions().length > 0}
				fallback={
					<EmptyState
						title="Nothing here yet"
						description="No releases match this filter. Try another change type."
					/>
				}
			>
				<ChangelogList versions={versions()} limit={props.limit} />
			</Show>
			<div class="flex items-center gap-3 text-xs text-muted-foreground">
				<Badge variant="outline">{props.versions.length} releases</Badge>
				<a class="hover:text-foreground" href="/changelog">
					Full changelog →
				</a>
			</div>
		</div>
	);
}
