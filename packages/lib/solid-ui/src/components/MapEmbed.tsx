/**
 * MapEmbed - framed map embed with optional marker caption (OpenStreetMap/Google src URL).
 */
import { type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface MapEmbedProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Embed iframe URL (OSM export / Google Maps embed). */
	src: string;
	/** Caption shown in the overlay chip, e.g. address. */
	caption?: string;
	/** Aspect height in px. @default 280 */
	height?: number;
	/** Accessible title for the iframe. @default "Map" */
	title?: string;
	/** Corner radius. */
	radius?: Radius;
}

export function MapEmbed(props: MapEmbedProps) {
	const [local, rest] = splitProps(props, ["class", "src", "caption", "height", "title", "radius"]);

	const className = () =>
		[
			"solidui-map-embed relative overflow-hidden border border-border bg-muted",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} style={{ height: `${local.height ?? 280}px` }} {...rest}>
			<iframe
				src={local.src}
				title={local.title ?? "Map"}
				class="h-full w-full border-0"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			/>
			<Show when={local.caption}>
				<span class="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-popover/95 px-2 py-1 text-xs text-foreground shadow-sm">
					<NamedIcon name="map-pin" class="h-3 w-3 text-primary" />
					{local.caption}
				</span>
			</Show>
		</div>
	);
}
