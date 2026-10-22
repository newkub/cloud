/**
 * AudioPlayer — styled <audio controls> with optional title and compact mode.
 */
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface AudioPlayerProps extends JSX.AudioHTMLAttributes<HTMLAudioElement> {
	/** Track title shown above the controls */
	title?: string;
	variant?: SurfaceVariant;
	/** Player density @default "md" */
	size?: "sm" | "md";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function AudioPlayer(props: AudioPlayerProps) {
	const [local, rest] = splitProps(props, ["class", "title", "variant", "size", "radius", "elevation"]);
	return (
		<div
			class={`solidui-audio-player border ${surfaceVariants[local.variant ?? "default"]} ${local.size === "sm" ? "p-2" : "p-3"} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
		>
			<Show when={local.title}>
				<p class="mb-2 truncate text-xs font-medium text-muted-foreground">{local.title}</p>
			</Show>
			<audio controls class="h-9 w-full" {...rest} />
		</div>
	);
}
