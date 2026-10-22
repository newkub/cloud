/**
 * ImageViewer — zoomable image dialog.
 * @deprecated Use `Lightbox` with `src` + `zoomable` — it also supports galleries,
 * keyboard navigation and captions.
 */
import { type JSX, splitProps } from "solid-js";
import type { Elevation, Radius, scrimVariants } from "../lib/variants";
import { Lightbox } from "./Lightbox";

export interface ImageViewerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	src?: string;
	alt?: string;
	zoomable?: boolean;
	/** Scrim style behind the viewer. */
	variant?: keyof typeof scrimVariants;
	/** Image corner radius. @default "lg" */
	radius?: Radius;
	/** Image shadow elevation. */
	elevation?: Elevation;
}

export function ImageViewer(props: ImageViewerProps) {
	const [local, rest] = splitProps(props, [
		"open",
		"onOpenChange",
		"src",
		"alt",
		"zoomable",
		"variant",
		"radius",
		"elevation",
		"children",
	]);
	return (
		<Lightbox
			open={local.open}
			onOpenChange={local.onOpenChange}
			src={local.src}
			alt={local.alt}
			zoomable={local.zoomable ?? true}
			variant={local.variant}
			radius={local.radius}
			elevation={local.elevation}
			{...rest}
		>
			{local.children}
		</Lightbox>
	);
}
