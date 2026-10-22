/**
 * VotingButtons — Reddit-style up/down vote control with score.
 */
import { type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface VotingButtonsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	score: number;
	/** User's current vote. */
	voted?: "up" | "down" | null;
	onVote?: (direction: "up" | "down" | null) => void;
	/** Layout direction. @default "vertical" */
	orientation?: "vertical" | "horizontal";
	/** Hide the score number. */
	hideScore?: boolean;
	/** Custom score formatting — e.g. compact "1.2k". */
	formatScore?: (score: number) => string;
	/** Accessible labels for the buttons. */
	labels?: { up?: string; down?: string };
	/** Show score and vote state without allowing changes. @default false */
	readOnly?: boolean;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	disabled?: boolean;
}

const iconSize = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" } as const;
const scoreSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function VotingButtons(props: VotingButtonsProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"score",
		"voted",
		"onVote",
		"orientation",
		"hideScore",
		"formatScore",
		"labels",
		"readOnly",
		"size",
		"radius",
		"disabled",
	]);
	const vote = (dir: "up" | "down") => {
		if (local.readOnly || local.disabled) return;
		local.onVote?.(local.voted === dir ? null : dir);
	};
	const btn = (dir: "up" | "down", label: string, path: string) => (
		<button
			type="button"
			disabled={local.disabled}
			aria-label={label}
			aria-pressed={local.voted === dir}
			aria-disabled={local.readOnly || undefined}
			class={`flex items-center justify-center p-1.5 motion-safe:transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-40 ${radiusMap[local.radius ?? "md"]} ${
				local.voted === dir
					? dir === "up"
						? "text-success"
						: "text-destructive"
					: `text-muted-foreground ${local.readOnly ? "cursor-default" : "hover:bg-muted hover:text-foreground"}`
			}`}
			onClick={() => vote(dir)}
		>
			<svg
				class={iconSize[local.size ?? "md"]}
				viewBox="0 0 24 24"
				fill={local.voted === dir ? "currentColor" : "none"}
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d={path} stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
	);

	return (
		<div
			class={`solidui-voting-buttons inline-flex items-center gap-0.5 ${local.orientation === "horizontal" ? "flex-row" : "flex-col"} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{btn("up", local.labels?.up ?? "Upvote", "m5 15 7-7 7 7")}
			{!local.hideScore && (
				<span
					class={`font-semibold tabular-nums ${scoreSize[local.size ?? "md"]} ${
						local.voted === "up" ? "text-success" : local.voted === "down" ? "text-destructive" : "text-foreground"
					}`}
					title={`Score ${local.score}`}
				>
					{local.formatScore ? local.formatScore(local.score) : local.score}
				</span>
			)}
			{btn("down", local.labels?.down ?? "Downvote", "m19 9-7 7-7-7")}
		</div>
	);
}
