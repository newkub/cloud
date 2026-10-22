/**
 * ImageGallery — main image with a thumbnail strip.
 */
import { createSignal, For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface GalleryImage {
	src: string;
	alt?: string;
}

export interface ImageGalleryProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	images?: GalleryImage[];
	/** Controlled active index */
	index?: number;
	/** Thumbnail size @default "md" */
	size?: "sm" | "md" | "lg";
	onSelect?: (index: number) => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const thumbSize = { sm: "h-10 w-14", md: "h-14 w-20", lg: "h-18 w-28" } as const;

export function ImageGallery(props: ImageGalleryProps) {
	const [local, rest] = splitProps(props, ["class", "images", "index", "size", "onSelect", "radius", "elevation"]);
	const [internal, setInternal] = createSignal(0);
	const active = () => Math.min(local.index ?? internal(), (local.images ?? []).length - 1);
	const select = (i: number) => {
		setInternal(i);
		local.onSelect?.(i);
	};
	return (
		<div class={`solidui-image-gallery space-y-2 ${local.class ?? ""}`.trim()} {...rest}>
			<div class="overflow-hidden rounded-lg border border-border bg-muted/30">
				{(local.images ?? [])[active()] ? (
					<img
						src={(local.images ?? [])[active()].src}
						alt={(local.images ?? [])[active()].alt ?? ""}
						class="aspect-video w-full object-cover"
					/>
				) : null}
			</div>
			<div class="flex gap-2 overflow-x-auto">
				<For each={local.images ?? []}>
					{(img, i) => (
						<button
							type="button"
							aria-label={`Image ${i() + 1}`}
							aria-current={i() === active()}
							class={`shrink-0 overflow-hidden border transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
								i() === active() ? "border-primary opacity-100" : "border-border opacity-60 hover:opacity-100"
							} ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""}`}
							onClick={() => select(i())}
						>
							<img src={img.src} alt={img.alt ?? ""} class={`${thumbSize[local.size ?? "md"]} object-cover`} />
						</button>
					)}
				</For>
			</div>
		</div>
	);
}
