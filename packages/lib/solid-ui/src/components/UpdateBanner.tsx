/**
 * UpdateBanner — "new version available" banner with refresh + dismiss.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface UpdateBannerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** New version string shown in the text. */
	version?: string;
	message?: string;
	onRefresh?: () => void;
	onDismiss?: () => void;
	/** Stick to an edge. @default "top" */
	position?: "top" | "bottom" | "inline";
	labels?: { refresh?: string; dismiss?: string };
	size?: "sm" | "md" | "lg";
	/** Corner radius (inline only). */
	radius?: Radius;
}

const pad = { sm: "px-3 py-1.5", md: "px-4 py-2", lg: "px-5 py-2.5" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function UpdateBanner(props: UpdateBannerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"version",
		"message",
		"onRefresh",
		"onDismiss",
		"position",
		"labels",
		"size",
		"radius",
	]);
	const pos = () =>
		local.position === "inline"
			? radiusMap[local.radius ?? "md"]
			: `fixed inset-x-0 z-40 ${
					local.position === "bottom"
						? "bottom-0 pb-[env(safe-area-inset-bottom)]"
						: "top-0 pt-[env(safe-area-inset-top)]"
				}`;
	return (
		<div
			role="status"
			class={`solidui-update-banner flex items-center justify-center gap-3 bg-primary px-4 text-primary-foreground ${pad[local.size ?? "md"]} ${pos()} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				class="h-3.5 w-3.5 shrink-0"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			<span class={textSize[local.size ?? "md"]}>
				{local.message ?? `A new version${local.version ? ` (v${local.version})` : ""} is available.`}
			</span>
			<Show when={local.onRefresh}>
				<button
					type="button"
					class={`-my-1.5 min-h-9 shrink-0 rounded-md bg-primary-foreground/15 px-2.5 py-1 font-medium transition-colors hover:bg-primary-foreground/25 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-foreground ${local.size === "sm" ? "text-2xs" : "text-xs"}`}
					onClick={() => local.onRefresh?.()}
				>
					{local.labels?.refresh ?? "Refresh"}
				</button>
			</Show>
			<Show when={local.onDismiss}>
				<button
					type="button"
					aria-label={local.labels?.dismiss ?? "Dismiss"}
					class="-my-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-foreground"
					onClick={() => local.onDismiss?.()}
				>
					<svg
						class="h-3.5 w-3.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
					</svg>
				</button>
			</Show>
		</div>
	);
}
