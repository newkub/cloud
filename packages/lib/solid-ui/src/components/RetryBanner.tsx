/**
 * RetryBanner — inline banner showing retry attempts with countdown and manual retry.
 */
import { createEffect, createSignal, type JSX, onCleanup, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface RetryBannerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Current attempt (1-based) — display only unless autoRetry drives it. */
	attempt?: number;
	maxAttempts?: number;
	/** Seconds until the next auto retry — shows a countdown bar. */
	retryInSeconds?: number;
	onRetry?: () => void;
	/** Tick down retryInSeconds and call onRetry at zero. @default false */
	autoRetry?: boolean;
	message?: string;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Full width. */
	fullWidth?: boolean;
}

const pad = { sm: "px-2.5 py-1.5", md: "px-3 py-2", lg: "px-4 py-2.5" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function RetryBanner(props: RetryBannerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"attempt",
		"maxAttempts",
		"retryInSeconds",
		"onRetry",
		"autoRetry",
		"message",
		"size",
		"radius",
		"fullWidth",
	]);
	const [left, setLeft] = createSignal(local.retryInSeconds ?? 0);
	let timer: ReturnType<typeof setInterval> | undefined;
	createEffect(() => {
		const start = local.retryInSeconds ?? 0;
		setLeft(start);
		clearInterval(timer);
		if (start > 0) {
			timer = setInterval(() => {
				setLeft((s) => {
					if (s <= 1) {
						clearInterval(timer);
						if (local.autoRetry) local.onRetry?.();
						return 0;
					}
					return s - 1;
				});
			}, 1000);
		}
	});
	onCleanup(() => clearInterval(timer));
	const pct = () => (local.retryInSeconds ? (left() / local.retryInSeconds) * 100 : 0);

	return (
		<div
			role="status"
			class={`solidui-retry-banner overflow-hidden border border-warning/50 bg-warning/10 ${radiusMap[local.radius ?? "md"]} ${local.fullWidth ? "w-full" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={`flex items-center gap-3 ${pad[local.size ?? "md"]}`}>
				<svg
					class="h-4 w-4 shrink-0 text-warning"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path
						d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span class={`flex-1 text-foreground ${textSize[local.size ?? "md"]}`}>
					{local.message ?? "Request failed."}
					<Show when={left() > 0}>
						<span class="tabular-nums text-muted-foreground"> Retrying in {left()}s</span>
					</Show>
					<Show when={local.attempt && local.maxAttempts}>
						<span class="text-muted-foreground">
							{" "}
							(attempt {local.attempt}/{local.maxAttempts})
						</span>
					</Show>
				</span>
				<Show when={local.onRetry}>
					<button
						type="button"
						class="h-9 shrink-0 rounded-md border border-border bg-surface px-2.5 text-2xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						onClick={() => local.onRetry?.()}
					>
						Retry now
					</button>
				</Show>
			</div>
			<Show when={local.retryInSeconds && left() > 0}>
				<div class="h-0.5 bg-warning/20">
					<div
						class="h-full bg-warning transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
						style={{ width: `${pct()}%` }}
					/>
				</div>
			</Show>
		</div>
	);
}
