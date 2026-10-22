/**
 * TrackList — playlist rows with index, title, artist, duration and a playing-state EQ indicator.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";

/** One playlist entry. */
export interface TrackListItem {
	title: string;
	artist: string;
	/** Seconds or a preformatted "m:ss" label. */
	duration: number | string;
}

const fmt = (d: number | string) =>
	typeof d === "string" ? d : `${Math.floor(d / 60)}:${String(Math.floor(d % 60)).padStart(2, "0")}`;

export interface TrackListProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onPlay"> {
	tracks: TrackListItem[];
	/** Index of the currently playing track — gets the EQ indicator. */
	current?: number;
	/** Called when a row is activated. */
	onPlay?: (index: number) => void;
	/** Show the artist name under the title. @default true */
	showArtist?: boolean;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
}

export function TrackList(props: TrackListProps) {
	const [local, rest] = splitProps(props, ["class", "tracks", "current", "onPlay", "showArtist", "variant", "radius"]);
	return (
		<div
			class={`solidui-track-list overflow-hidden border ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<ol class="divide-y divide-border">
				<For each={local.tracks}>
					{(track, i) => (
						<li>
							<button
								type="button"
								aria-current={i() === local.current ? "true" : undefined}
								class={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
									i() === local.current ? "bg-primary/10" : "hover:bg-muted/50"
								}`}
								onClick={() => local.onPlay?.(i())}
							>
								<Show
									when={i() === local.current}
									fallback={
										<span class="w-6 shrink-0 text-center text-xs tabular-nums text-muted-foreground">{i() + 1}</span>
									}
								>
									<span class="flex h-3.5 w-6 shrink-0 items-end justify-center gap-0.5" aria-hidden="true">
										<span class="w-0.5 rounded-full bg-primary motion-safe:animate-pulse" style={{ height: "45%" }} />
										<span
											class="w-0.5 rounded-full bg-primary motion-safe:animate-pulse"
											style={{ height: "100%", "animation-delay": "150ms" }}
										/>
										<span
											class="w-0.5 rounded-full bg-primary motion-safe:animate-pulse"
											style={{ height: "65%", "animation-delay": "300ms" }}
										/>
									</span>
								</Show>
								<span class="min-w-0 flex-1">
									<span
										class={`block truncate text-sm font-medium ${i() === local.current ? "text-primary" : "text-foreground"}`}
									>
										{track.title}
									</span>
									<Show when={local.showArtist ?? true}>
										<span class="block truncate text-xs text-muted-foreground">{track.artist}</span>
									</Show>
								</span>
								<span class="shrink-0 text-xs tabular-nums text-muted-foreground">{fmt(track.duration)}</span>
							</button>
						</li>
					)}
				</For>
			</ol>
		</div>
	);
}
