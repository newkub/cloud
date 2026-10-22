/**
 * MediaCard — image/video cover with a duration badge and a gradient title overlay.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

const aspectMap = { video: "aspect-video", square: "aspect-square", wide: "aspect-[21/9]" } as const;

const fmt = (d: number | string) =>
	typeof d === "string" ? d : `${Math.floor(d / 60)}:${String(Math.floor(d % 60)).padStart(2, "0")}`;

export interface MediaCardProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "title"> {
	/** Media URL — a gradient placeholder is drawn when omitted. */
	src?: string;
	/** Media kind. @default "image" */
	type?: "image" | "video";
	/** Seconds or a preformatted label — shown as a badge bottom-right. */
	duration?: number | string;
	/** Title overlaid at the bottom. */
	title: string;
	/** Secondary line under the title. */
	subtitle?: string;
	/** Media area aspect ratio. @default "video" */
	aspect?: keyof typeof aspectMap;
	/** Corner radius. */
	radius?: Radius;
}

export function MediaCard(props: MediaCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"src",
		"type",
		"duration",
		"title",
		"subtitle",
		"aspect",
		"radius",
	]);
	return (
		<figure
			class={`solidui-media-card relative overflow-hidden border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={`relative ${aspectMap[local.aspect ?? "video"]} bg-muted`}>
				<Show
					when={local.src}
					fallback={
						<div
							role="img"
							aria-label={local.title}
							class="h-full w-full bg-gradient-to-br from-primary/40 via-muted to-info/30"
						/>
					}
				>
					{(src) =>
						local.type === "video" ? (
							<video
								src={src()}
								muted
								playsinline
								preload="metadata"
								aria-label={local.title}
								class="h-full w-full object-cover"
							/>
						) : (
							<img src={src()} alt={local.title} class="h-full w-full object-cover" />
						)
					}
				</Show>
				<div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-3 pt-8">
					<p class="truncate text-sm font-semibold text-white">{local.title}</p>
					<Show when={local.subtitle}>
						<p class="truncate text-xs text-white/80">{local.subtitle}</p>
					</Show>
				</div>
				<Show when={local.duration !== undefined}>
					<span class="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-2xs font-medium tabular-nums text-white">
						{fmt(local.duration ?? "")}
					</span>
				</Show>
			</div>
		</figure>
	);
}
