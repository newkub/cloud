/**
 * Image with fallback
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface ImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	fallback?: JSX.Element;
	fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Image(props: ImageProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"src",
		"alt",
		"fallback",
		"fit",
		"onError",
		"radius",
		"elevation",
	]);
	const [error, setError] = createSignal(false);

	const objectFit = () => local.fit ?? "cover";
	const className = () =>
		[
			"max-w-full h-auto ",
			`object-${objectFit()}`,
			local.variant ? surfaceVariants[local.variant] : "",
			local.size ? paddingSizes[local.size] : "",
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const handleError: JSX.EventHandler<HTMLImageElement, ErrorEvent> = (e) => {
		setError(true);
		if (typeof local.onError === "function") {
			local.onError(e);
		}
	};

	const fallbackContent = () => {
		if (typeof local.fallback === "string") {
			return (
				<div class="flex h-full w-full items-center justify-center rounded-md bg-muted text-muted-foreground">
					{local.fallback}
				</div>
			);
		}
		if (local.fallback !== undefined) return local.fallback;
		return (
			<div class="flex h-full w-full items-center justify-center rounded-md border border-dashed border-border bg-muted text-sm text-muted-foreground">
				Image failed to load
			</div>
		);
	};

	return (
		<Show when={!error() && local.src} fallback={fallbackContent()}>
			<img class={className()} src={local.src} alt={local.alt ?? ""} onError={handleError} {...rest} />
		</Show>
	);
}
