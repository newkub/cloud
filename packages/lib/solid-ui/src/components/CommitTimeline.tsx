/**
 * CommitTimeline — horizontal commit graph: branch lanes with dots per
 * commit; hovering (or focusing) a dot shows message, author and sha.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface CommitInfo {
	/** Full or abbreviated sha */
	sha: string;
	/** Commit message */
	msg: string;
	/** Author name */
	author: string;
	/** Branch/lane name — commits on the same branch share a lane. @default "main" */
	branch?: string;
	/** Timestamp shown in the tooltip. */
	ts?: string;
}

export interface CommitTimelineProps extends JSX.HTMLAttributes<HTMLDivElement> {
	commits: CommitInfo[];
	/** Corner radius. */
	radius?: Radius;
}

const LANE_H = 26;
const COL_W = 52;
const PAD = 20;
const LANE_COLORS = ["text-info", "text-success", "text-warning", "text-destructive"] as const;

export function CommitTimeline(props: CommitTimelineProps) {
	const [local, rest] = splitProps(props, ["class", "commits", "radius"]);
	const commits = () => local.commits ?? [];
	const branches = () => [...new Set(commits().map((c) => c.branch ?? "main"))];
	const laneY = (i: number) => PAD + i * LANE_H;
	const laneIndex = (branch?: string) => Math.max(branches().indexOf(branch ?? "main"), 0);
	const laneColor = (branch?: string) => LANE_COLORS[laneIndex(branch) % LANE_COLORS.length];
	const width = () => commits().length * COL_W + PAD * 2;
	const height = () => branches().length * LANE_H + PAD;

	return (
		<div
			class={`solidui-commit-timeline overflow-x-auto border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="relative" style={{ width: `${width()}px`, height: `${height()}px` }}>
				<For each={branches()}>
					{(b, i) => (
						<div
							class={`absolute left-4 right-4 h-px bg-border ${laneColor(b)}`}
							style={{ top: `${laneY(i())}px`, opacity: 0.5 }}
							aria-hidden="true"
						/>
					)}
				</For>
				<For each={commits()}>
					{(c, i) => {
						const x = () => PAD + i() * COL_W + COL_W / 2;
						const y = () => laneY(laneIndex(c.branch));
						return (
							<div class="group absolute" style={{ left: `${x() - 6}px`, top: `${y() - 6}px` }}>
								<button
									type="button"
									class={`block h-3 w-3 rounded-full border-2 border-surface bg-current outline-none ring-border transition-transform focus-visible:ring-2 group-hover:scale-125 ${laneColor(c.branch)}`}
									aria-label={`${c.sha.slice(0, 7)}: ${c.msg} by ${c.author}`}
									title={`${c.msg} — ${c.author}`}
								/>
								<div
									class="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-52 -translate-x-1/2 rounded-md border border-border bg-surface p-2 shadow-md group-focus-within:block group-hover:block"
									role="tooltip"
								>
									<p class="m-0 truncate text-xs font-medium text-foreground">{c.msg}</p>
									<p class="m-0 mt-1 font-mono text-2xs text-muted-foreground">
										{c.sha.slice(0, 7)} · {c.author}
										{c.branch ? ` · ${c.branch}` : ""}
									</p>
									{c.ts ? <p class="m-0 mt-0.5 text-2xs text-muted-foreground/70">{c.ts}</p> : null}
								</div>
							</div>
						);
					}}
				</For>
			</div>
		</div>
	);
}
