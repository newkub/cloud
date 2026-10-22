/**
 * Poll — poll options with vote bars and percentages.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface PollOption {
	id: string;
	label: string;
	votes: number;
}

export interface PollProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	question: string;
	options: PollOption[];
	/** Option id the user voted for — switches to results mode. */
	voted?: string;
	onVote?: (option: PollOption) => void;
	/** Persist the vote in localStorage under this key — restored on mount. */
	storageKey?: string;
	/** Total voter count — defaults to sum of votes. */
	totalVotes?: number;
	/** Hide voter identity info. @default false */
	anonymous?: boolean;
	/** Show % text on bars. @default true */
	showPercent?: boolean;
	/** Always show results (no voting). */
	showResults?: boolean;
	/** Block voting without hiding the UI. @default false */
	disabled?: boolean;
	/** Stretch to fill the container width. @default true */
	fullWidth?: boolean;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-3", md: "p-4", lg: "p-5" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

function readStoredVote(key: string | undefined): string | undefined {
	if (!key) return undefined;
	try {
		return globalThis.localStorage?.getItem(`solidui-poll:${key}`) ?? undefined;
	} catch {
		return undefined;
	}
}

export function Poll(props: PollProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"question",
		"options",
		"voted",
		"onVote",
		"storageKey",
		"totalVotes",
		"anonymous",
		"showPercent",
		"showResults",
		"disabled",
		"fullWidth",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	const [internalVoted, setInternalVoted] = createSignal<string | undefined>(readStoredVote(local.storageKey));
	const votedId = () => local.voted ?? internalVoted();
	const total = () => local.totalVotes ?? (local.options ?? []).reduce((s, o) => s + o.votes, 0);
	const results = () => Boolean(votedId()) || Boolean(local.showResults);
	const pct = (o: PollOption) => (total() > 0 ? Math.round((o.votes / total()) * 100) : 0);

	const cast = (o: PollOption) => {
		if (results() || local.disabled) return;
		setInternalVoted(o.id);
		if (local.storageKey) {
			try {
				globalThis.localStorage?.setItem(`solidui-poll:${local.storageKey}`, o.id);
			} catch {
				/* storage unavailable */
			}
		}
		local.onVote?.(o);
	};

	return (
		<div
			class={`solidui-poll ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${(local.fullWidth ?? true) ? "w-full" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class={`font-semibold text-foreground ${local.size === "lg" ? "text-base" : "text-sm"}`}>
				{local.question}
			</div>
			<div class="mt-3 space-y-1.5">
				<For each={local.options ?? []}>
					{(o) => {
						const mine = () => votedId() === o.id;
						return (
							// biome-ignore lint/a11y/useAriaPropsSupportedByRole lint/a11y/noStaticElementInteractions: option rows become buttons only when voting
							<div
								role={results() ? undefined : "button"}
								tabIndex={results() ? undefined : 0}
								aria-label={results() ? undefined : `Vote for ${o.label}`}
								aria-disabled={!results() && local.disabled ? true : undefined}
								class={`relative overflow-hidden border px-3 py-2 ${radiusMap[local.radius ?? "md"]} ${
									results()
										? ""
										: `motion-safe:transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
												local.disabled
													? "cursor-not-allowed border-border opacity-60"
													: "cursor-pointer border-border hover:border-primary hover:bg-primary/5"
											}`
								} ${mine() ? "border-primary" : "border-border"}`}
								onClick={() => cast(o)}
								onKeyDown={(e) => {
									if (!results() && !local.disabled && (e.key === "Enter" || e.key === " ")) {
										e.preventDefault();
										cast(o);
									}
								}}
							>
								<Show when={results()}>
									<div
										class={`absolute inset-y-0 left-0 motion-safe:transition-all motion-safe:duration-500 motion-reduce:transition-none ${mine() ? "bg-primary/20" : "bg-muted/60"}`}
										style={{ width: `${pct(o)}%` }}
										aria-hidden="true"
									/>
								</Show>
								<div class={`relative flex items-center justify-between gap-2 ${textSize[local.size ?? "md"]}`}>
									<span class={`min-w-0 truncate font-medium ${mine() ? "text-primary" : "text-foreground"}`}>
										{o.label}
										<Show when={mine()}>
											<svg
												class="ml-1 inline h-3 w-3"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2.5"
												aria-hidden="true"
											>
												<path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
											</svg>
										</Show>
									</span>
									<Show when={results() && (local.showPercent ?? true)}>
										<span class="tabular-nums text-muted-foreground">{pct(o)}%</span>
									</Show>
								</div>
							</div>
						);
					}}
				</For>
			</div>
			<div class="mt-2 text-2xs text-muted-foreground">
				{total().toLocaleString()} votes{local.anonymous ? " · anonymous" : ""}
			</div>
		</div>
	);
}
