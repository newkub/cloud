/**
 * CookieBanner — consent banner with accept/decline/customize actions.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface CookieCategory {
	key: string;
	label: string;
	description?: string;
	/** Locked-on category (e.g. "essential"). */
	required?: boolean;
}

export interface CookieBannerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Show/hide the banner (controlled). @default true */
	open?: boolean;
	title?: string;
	message?: string;
	/** Policy link text + href. */
	policyHref?: string;
	policyLabel?: string;
	onAccept?: () => void;
	onDecline?: () => void;
	/** Called with selected category keys when customizing. */
	onCustomize?: (categories: string[]) => void;
	categories?: CookieCategory[];
	/** Stick to the viewport edge. */
	position?: "bottom" | "top" | "floating";
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function CookieBanner(props: CookieBannerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"open",
		"title",
		"message",
		"policyHref",
		"policyLabel",
		"onAccept",
		"onDecline",
		"onCustomize",
		"categories",
		"position",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	let selected: Set<string>;
	const getSelected = () =>
		(selected ??= new Set((local.categories ?? []).filter((c) => c.required).map((c) => c.key)));

	const pos = () =>
		local.position === "floating"
			? "fixed bottom-4 right-4 max-w-md"
			: local.position === "top"
				? "sticky top-0"
				: "sticky bottom-0";

	return (
		<Show when={local.open ?? true}>
			<div
				role="dialog"
				aria-label={local.title ?? "Cookie consent"}
				class={`solidui-cookie-banner z-40 ${pos()} ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : "shadow-lg"} ${local.class ?? ""}`.trim()}
				{...rest}
			>
				<div class={`font-semibold text-foreground ${local.size === "lg" ? "text-base" : "text-sm"}`}>
					{local.title ?? "We use cookies"}
				</div>
				<p class={`mt-1 text-muted-foreground ${textSize[local.size ?? "md"]}`}>
					{local.message ?? "We use cookies to improve your experience and analyze traffic."}
					<Show when={local.policyHref}>
						{" "}
						<a href={local.policyHref} class="text-primary underline-offset-2 hover:underline">
							{local.policyLabel ?? "Learn more"}
						</a>
					</Show>
				</p>
				<Show when={local.onCustomize && local.categories?.length}>
					<div class="mt-2 space-y-1">
						<For each={local.categories}>
							{(c) => (
								<label class={`flex items-start gap-2 ${c.required ? "opacity-70" : "cursor-pointer"}`}>
									<input
										type="checkbox"
										class="mt-0.5 h-3.5 w-3.5 accent-primary"
										checked={getSelected().has(c.key)}
										disabled={c.required}
										onChange={(e) => {
											if (e.currentTarget.checked) getSelected().add(c.key);
											else getSelected().delete(c.key);
										}}
									/>
									<span>
										<span class={`font-medium text-foreground ${textSize[local.size ?? "md"]}`}>{c.label}</span>
										<Show when={c.description}>
											<span class="block text-2xs text-muted-foreground">{c.description}</span>
										</Show>
									</span>
								</label>
							)}
						</For>
					</div>
				</Show>
				<div class="mt-3 flex flex-wrap gap-2">
					<button
						type="button"
						class="h-8 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						onClick={() => local.onAccept?.()}
					>
						Accept all
					</button>
					<Show when={local.onCustomize}>
						<button
							type="button"
							class="h-8 rounded-md border border-border bg-transparent px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							onClick={() => local.onCustomize?.([...getSelected()])}
						>
							Save choices
						</button>
					</Show>
					<Show when={local.onDecline}>
						<button
							type="button"
							class="h-8 rounded-md px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							onClick={() => local.onDecline?.()}
						>
							Decline
						</button>
					</Show>
				</div>
			</div>
		</Show>
	);
}
