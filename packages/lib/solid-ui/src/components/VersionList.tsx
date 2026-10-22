/**
 * VersionList — document version history rows: version number, author,
 * relative time, a +n/−n diff summary and a restore button.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface VersionEntry {
	id: string;
	author: string;
	/** Timestamp — epoch ms, ISO string or Date. */
	ts: number | string | Date;
	/** Lines/words added in this version. */
	added: number;
	/** Lines/words removed in this version. */
	removed: number;
	/** Optional change note. */
	message?: string;
}

const timeAgo = (ts: number | string | Date): string => {
	const t = new Date(ts).getTime();
	if (Number.isNaN(t)) return "";
	const s = Math.max(0, (Date.now() - t) / 1000);
	if (s < 60) return "just now";
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.floor(h / 24);
	if (d < 30) return `${d}d ago`;
	return new Date(t).toLocaleDateString();
};

export interface VersionListProps extends JSX.HTMLAttributes<HTMLUListElement> {
	/** Versions, newest first. */
	versions?: VersionEntry[];
	/** Id of the live version — its row shows a "current" chip and no restore button. */
	currentId?: string;
	/** Called with the version to restore. */
	onRestore?: (version: VersionEntry) => void;
	/** Corner radius. */
	radius?: Radius;
}

export function VersionList(props: VersionListProps) {
	const [local, rest] = splitProps(props, ["class", "versions", "currentId", "onRestore", "radius"]);
	const versions = () => local.versions ?? [];

	return (
		<ul
			aria-label="Version history"
			class={`solidui-version-list m-0 list-none divide-y divide-border border border-border bg-surface p-0 ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For
				each={versions()}
				fallback={<li class="m-0 px-3 py-4 text-center text-xs text-muted-foreground">No versions yet</li>}
			>
				{(v, i) => (
					<li class="flex items-center gap-3 px-3 py-2">
						<span class="w-8 shrink-0 text-xs font-semibold tabular-nums text-foreground">
							v{versions().length - i()}
						</span>
						<span class="min-w-0 flex-1">
							<span class="block truncate text-xs font-medium text-foreground">
								{v.author}
								<Show when={v.id === local.currentId}>
									<span class="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-2xs font-medium text-primary">
										current
									</span>
								</Show>
							</span>
							<Show when={v.message}>
								<span class="block truncate text-2xs text-muted-foreground">{v.message}</span>
							</Show>
						</span>
						<span class="shrink-0 text-2xs text-muted-foreground">{timeAgo(v.ts)}</span>
						<span class="shrink-0 text-2xs tabular-nums">
							<span class="text-success">+{v.added}</span> <span class="text-destructive">−{v.removed}</span>
						</span>
						<Show when={v.id !== local.currentId}>
							<button
								type="button"
								aria-label={`Restore version ${versions().length - i()}`}
								onClick={() => local.onRestore?.(v)}
								class="shrink-0 rounded px-2 py-1 text-2xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								Restore
							</button>
						</Show>
					</li>
				)}
			</For>
		</ul>
	);
}
