/**
 * BrowserFrame — browser-chrome frame around screenshots or live content.
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

export interface BrowserFrameProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** URL shown in the address bar. */
	url?: string;
	/** Show back/forward/reload controls. @default true */
	showNav?: boolean;
	/** Tab title shown next to the controls. */
	title?: string;
	/** Fill the frame with the image at this src. */
	src?: string;
	alt?: string;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function BrowserFrame(props: BrowserFrameProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"url",
		"showNav",
		"title",
		"src",
		"alt",
		"variant",
		"radius",
		"elevation",
	]);
	return (
		<div
			class={`solidui-browser-frame overflow-hidden ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-2">
				<span class="flex gap-1.5" aria-hidden="true">
					<span class="h-2.5 w-2.5 rounded-full bg-destructive/70" />
					<span class="h-2.5 w-2.5 rounded-full bg-warning/70" />
					<span class="h-2.5 w-2.5 rounded-full bg-success/70" />
				</span>
				<Show when={local.showNav ?? true}>
					<span class="flex gap-1 text-muted-foreground" aria-hidden="true">
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path
								d="M4 4v6h6M20 20v-6h-6M20 9A8 8 0 0 0 6.3 5.3L4 7.6M4 15a8 8 0 0 0 13.7 3.7L20 16.4"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				</Show>
				<Show when={local.url ?? local.title}>
					<span class="flex h-6 min-w-0 flex-1 items-center gap-1.5 rounded-md bg-background px-2.5 text-2xs text-muted-foreground">
						<svg
							class="h-3 w-3 shrink-0"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<rect x="4" y="10" width="16" height="10" rx="2" />
							<path d="M8 10V7a4 4 0 0 1 8 0v3" />
						</svg>
						<span class="truncate">{local.url ?? local.title}</span>
					</span>
				</Show>
			</div>
			<div class="bg-background">
				{local.src ? <img src={local.src} alt={local.alt ?? local.title ?? ""} class="block w-full" /> : local.children}
			</div>
		</div>
	);
}
