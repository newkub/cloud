/**
 * AlbumCard — stacked-cover art with title, artist and a track count / duration footer.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

/** Album metadata. */
export interface Album {
	/** Cover image URL — gradient monogram art is drawn when omitted. */
	cover?: string;
	title: string;
	artist: string;
	/** Number of tracks. */
	tracks: number;
	/** Total runtime in seconds or a preformatted label. */
	duration: number | string;
}

const fmt = (d: number | string) => {
	if (typeof d === "string") return d;
	const t = Math.max(0, Math.floor(d));
	const h = Math.floor(t / 3600);
	const m = Math.floor((t % 3600) / 60);
	const s = String(t % 60).padStart(2, "0");
	return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
};

export interface AlbumCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	album?: Album;
	/** Corner radius. */
	radius?: Radius;
}

export function AlbumCard(props: AlbumCardProps) {
	const [local, rest] = splitProps(props, ["class", "album", "radius"]);
	return (
		<div
			class={`solidui-album-card w-full max-w-56 border border-border bg-surface p-3 text-foreground shadow-sm ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="relative mb-4 mr-2">
				<div
					class={`absolute inset-0 translate-x-2 rotate-3 border border-border bg-muted ${radiusMap[local.radius ?? "md"]}`}
					aria-hidden="true"
				/>
				<div
					class={`absolute inset-0 translate-x-1 rotate-1 border border-border bg-muted/70 ${radiusMap[local.radius ?? "md"]}`}
					aria-hidden="true"
				/>
				<div class={`relative aspect-square overflow-hidden border border-border ${radiusMap[local.radius ?? "md"]}`}>
					<Show
						when={local.album?.cover}
						fallback={
							<div
								role="img"
								aria-label={`Cover of ${local.album?.title}`}
								class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-info/60 to-muted"
							>
								<span class="text-4xl font-bold text-primary-foreground">{local.album?.title.charAt(0)}</span>
							</div>
						}
					>
						{(src) => <img src={src()} alt={`Cover of ${local.album?.title}`} class="h-full w-full object-cover" />}
					</Show>
				</div>
			</div>
			<p class="truncate text-sm font-semibold">{local.album?.title}</p>
			<p class="truncate text-xs text-muted-foreground">{local.album?.artist}</p>
			<div class="mt-2 flex items-center justify-between border-t border-border pt-2 text-2xs tabular-nums text-muted-foreground">
				<span>{local.album?.tracks} tracks</span>
				<span>{fmt(local.album?.duration ?? "")}</span>
			</div>
		</div>
	);
}
