/**
 * CommitCard — git commit row: sha, message, author, time, verified badge.
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CommitCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	sha: string;
	message: string;
	author?: string;
	authorAvatar?: string;
	/** Relative time text. */
	time?: string;
	/** GPG verified chip. */
	verified?: boolean;
	/** +/- change stats. */
	additions?: number;
	deletions?: number;
	files?: number;
	/** Copy sha on click. @default true */
	copyable?: boolean;
	href?: string;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "p-2", md: "p-2.5", lg: "p-3" } as const;
const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function CommitCard(props: CommitCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"sha",
		"message",
		"author",
		"authorAvatar",
		"time",
		"verified",
		"additions",
		"deletions",
		"files",
		"copyable",
		"href",
		"size",
		"radius",
		"elevation",
	]);
	const { copy: copyText, copied } = useCopyToClipboard(1500);
	const short = () => (local.sha ?? "").slice(0, 7);
	const copy = () => {
		if (!(local.copyable ?? true)) return;
		void copyText(local.sha ?? "");
	};
	const message = () =>
		local.href ? (
			<a
				href={local.href}
				class="font-medium text-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			>
				{local.message}
			</a>
		) : (
			<span class="font-medium text-foreground">{local.message}</span>
		);
	return (
		<div
			class={`solidui-commit-card flex items-center gap-3 border-b border-border/50 last:border-0 ${pad[local.size ?? "md"]} ${textSize[local.size ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.authorAvatar}>
				<img src={local.authorAvatar} alt="" class="h-6 w-6 shrink-0 rounded-full" />
			</Show>
			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-1.5">
					<span class="truncate">{message()}</span>
					<Show when={local.verified}>
						<span
							class={`shrink-0 border border-success/40 px-1 font-medium text-success ${radiusMap[local.radius ?? "sm"]} text-3xs`}
						>
							Verified
						</span>
					</Show>
				</div>
				<div class="mt-0.5 flex items-center gap-2 text-2xs text-muted-foreground">
					<Show when={local.author}>
						<span>{local.author}</span>
					</Show>
					<Show when={local.time}>
						<span>committed {local.time}</span>
					</Show>
					<Show when={local.files}>
						<span class="tabular-nums">{local.files} files</span>
					</Show>
					<Show when={local.additions !== undefined}>
						<span class="tabular-nums text-success">+{local.additions}</span>
					</Show>
					<Show when={local.deletions !== undefined}>
						<span class="tabular-nums text-destructive">−{local.deletions}</span>
					</Show>
				</div>
			</div>
			<button
				type="button"
				aria-label={copied() ? "Copied" : `Copy sha ${short()}`}
				class={`shrink-0 border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${radiusMap[local.radius ?? "sm"]} ${(local.copyable ?? true) ? "cursor-pointer" : "cursor-default"}`}
				onClick={copy}
			>
				{copied() ? "copied" : short()}
			</button>
		</div>
	);
}
