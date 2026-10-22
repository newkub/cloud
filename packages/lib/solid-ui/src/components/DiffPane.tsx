/**
 * DiffPane — changed-files list with per-file stats, status icon and an
 * expandable mini-diff preview. Companion to DiffViewer (full diff) and
 * DiffTable.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface DiffFile {
	/** File path */
	path: string;
	/** Lines added */
	added: number;
	/** Lines removed */
	removed: number;
	/** Change kind — picks the status letter + color */
	status: "modified" | "added" | "deleted" | "renamed";
	/** Mini diff lines shown when expanded. A leading "+"/"-"/"@@" picks the row color. */
	lines?: string[];
}

export interface DiffPaneProps extends JSX.HTMLAttributes<HTMLDivElement> {
	files: DiffFile[];
	/** Corner radius. */
	radius?: Radius;
}

const statusMeta: Record<DiffFile["status"], { letter: string; cls: string; label: string }> = {
	modified: { letter: "M", cls: "text-warning", label: "Modified" },
	added: { letter: "A", cls: "text-success", label: "Added" },
	deleted: { letter: "D", cls: "text-destructive", label: "Deleted" },
	renamed: { letter: "R", cls: "text-info", label: "Renamed" },
};

const lineCls = (line: string) =>
	line.startsWith("+")
		? "bg-success/10 text-success"
		: line.startsWith("-")
			? "bg-destructive/10 text-destructive"
			: line.startsWith("@@")
				? "text-info"
				: "text-muted-foreground";

export function DiffPane(props: DiffPaneProps) {
	const [local, rest] = splitProps(props, ["class", "files", "radius"]);
	const [open, setOpen] = createSignal<Set<number>>(new Set());

	const toggle = (i: number) =>
		setOpen((s) => {
			const next = new Set(s);
			if (next.has(i)) next.delete(i);
			else next.add(i);
			return next;
		});

	return (
		<div
			class={`solidui-diff-pane divide-y divide-border border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.files ?? []}>
				{(f, i) => {
					const meta = () => statusMeta[f.status] ?? statusMeta.modified;
					const total = () => Math.max(f.added + f.removed, 1);
					return (
						<div>
							<button
								type="button"
								class="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								aria-expanded={open().has(i())}
								aria-label={`${meta().label} ${f.path}`}
								onClick={() => toggle(i())}
							>
								<span class={`w-4 shrink-0 text-center font-mono text-xs font-bold ${meta().cls}`} aria-hidden="true">
									{meta().letter}
								</span>
								<span class="min-w-0 flex-1 truncate font-mono text-xs text-foreground">{f.path}</span>
								<Show when={f.added > 0}>
									<span class="shrink-0 font-mono text-2xs text-success">+{f.added}</span>
								</Show>
								<Show when={f.removed > 0}>
									<span class="shrink-0 font-mono text-2xs text-destructive">−{f.removed}</span>
								</Show>
								<span class="flex h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted" aria-hidden="true">
									<span class="bg-success" style={{ width: `${(f.added / total()) * 100}%` }} />
									<span class="bg-destructive" style={{ width: `${(f.removed / total()) * 100}%` }} />
								</span>
								<svg
									class={`h-3 w-3 shrink-0 text-muted-foreground transition-transform ${open().has(i()) ? "rotate-180" : ""}`}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</button>
							<Show when={open().has(i())}>
								<div class="border-t border-border/50 bg-muted/30 font-mono text-2xs">
									<Show
										when={f.lines?.length}
										fallback={<p class="m-0 px-3 py-2 text-muted-foreground">No preview available.</p>}
									>
										<For each={f.lines}>
											{(line) => <div class={`whitespace-pre px-3 py-0.5 ${lineCls(line)}`}>{line}</div>}
										</For>
									</Show>
								</div>
							</Show>
						</div>
					);
				}}
			</For>
			<Show when={(local.files ?? []).length === 0}>
				<p class="m-0 px-3 py-2 text-xs text-muted-foreground">No changed files.</p>
			</Show>
		</div>
	);
}
