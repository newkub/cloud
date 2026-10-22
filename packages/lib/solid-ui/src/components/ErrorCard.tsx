/**
 * ErrorCard — structured error display with code, details and retry action.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface ErrorCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title?: string;
	message: string;
	/** Error code / type chip, e.g. "EAI_AGAIN". */
	code?: string;
	/** Collapsible detail block (stack, response body). */
	details?: string;
	onRetry?: () => void;
	/** Secondary action link. */
	secondary?: { label: string; href?: string; onClick?: () => void };
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Full-width card. */
	fullWidth?: boolean;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const titleSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;

export function ErrorCard(props: ErrorCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"message",
		"code",
		"details",
		"onRetry",
		"secondary",
		"size",
		"radius",
		"elevation",
		"fullWidth",
	]);
	const [open, setOpen] = createSignal(false);
	return (
		<div
			role="alert"
			class={`solidui-error-card border border-destructive/40 bg-destructive/5 ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.fullWidth ? "w-full" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-start gap-3">
				<svg
					class="mt-0.5 h-4 w-4 shrink-0 text-destructive"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="9" />
					<path d="M12 8v4m0 4h.01" stroke-linecap="round" />
				</svg>
				<div class="min-w-0 flex-1">
					<div class="flex items-center gap-2">
						<span class={`font-semibold text-destructive ${titleSize[local.size ?? "md"]}`}>
							{local.title ?? "Something went wrong"}
						</span>
						<Show when={local.code}>
							<code class="rounded bg-destructive/10 px-1.5 py-0.5 font-mono text-2xs text-destructive">
								{local.code}
							</code>
						</Show>
					</div>
					<p class="mt-1 text-xs text-foreground/80">{local.message}</p>
					<Show when={local.details}>
						<button
							type="button"
							class="mt-1.5 inline-flex min-h-9 items-center text-2xs font-medium text-muted-foreground underline-offset-2 hover:underline focus-visible:outline-none"
							aria-expanded={open()}
							onClick={() => setOpen(!open())}
						>
							{open() ? "Hide details" : "Show details"}
						</button>
						<Show when={open()}>
							<pre class="mt-2 max-h-48 overflow-auto rounded bg-muted/60 p-2 font-mono text-2xs text-foreground/80">
								{local.details}
							</pre>
						</Show>
					</Show>
					<Show when={local.onRetry || local.secondary}>
						<div class="mt-3 flex gap-2">
							<Show when={local.onRetry}>
								<button
									type="button"
									class="h-9 rounded-md bg-destructive px-3 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									onClick={() => local.onRetry?.()}
								>
									Try again
								</button>
							</Show>
							<Show when={local.secondary}>
								{(s) => (
									<a
										href={s().href ?? "#"}
										class="inline-flex h-9 items-center rounded-md border border-border bg-transparent px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
										onClick={(e) => {
											if (!s().href) e.preventDefault();
											s().onClick?.();
										}}
									>
										{s().label}
									</a>
								)}
							</Show>
						</div>
					</Show>
				</div>
			</div>
		</div>
	);
}
