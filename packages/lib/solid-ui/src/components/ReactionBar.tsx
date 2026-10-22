/**
 * ReactionBar — emoji reactions row (like/dislike/heart…) with counts and user state.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface Reaction {
	/** Emoji or icon element. */
	icon: JSX.Element;
	key: string;
	/** Count. */
	count?: number;
	/** Tooltip label. */
	label?: string;
}

export interface ReactionBarProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onToggle"> {
	reactions: Reaction[];
	/** Keys the current user has activated. */
	active?: string[];
	/** Called when a reaction is toggled. */
	onReact?: (key: string, active: boolean) => void;
	/** Alias for `onReact` — both fire if provided. */
	onToggle?: (key: string, active: boolean) => void;
	/** Max buttons before overflow "+N more". */
	max?: number;
	/** Show per-reaction counts. @default true */
	showCounts?: boolean;
	/** Display reactions without allowing toggles. @default false */
	readOnly?: boolean;
	size?: "sm" | "md" | "lg";
	/** Corner radius on pills. */
	radius?: Radius;
	disabled?: boolean;
}

const pillSize = {
	sm: "h-6 text-xs gap-1 px-2",
	md: "h-7 text-sm gap-1.5 px-2.5",
	lg: "h-8 text-base gap-2 px-3",
} as const;

export function ReactionBar(props: ReactionBarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"reactions",
		"active",
		"onReact",
		"onToggle",
		"max",
		"showCounts",
		"readOnly",
		"size",
		"radius",
		"disabled",
	]);
	const active = () => new Set(local.active ?? []);
	const reactions = () => local.reactions ?? [];
	const visible = () => (local.max ? reactions().slice(0, local.max) : reactions());
	const overflow = () => reactions().length - visible().length;
	const toggle = (key: string, on: boolean) => {
		if (local.readOnly || local.disabled) return;
		local.onReact?.(key, on);
		local.onToggle?.(key, on);
	};

	return (
		<div class={`solidui-reaction-bar inline-flex flex-wrap items-center gap-1 ${local.class ?? ""}`.trim()} {...rest}>
			<For each={visible()}>
				{(r) => {
					const on = () => active().has(r.key);
					return (
						<button
							type="button"
							disabled={local.disabled}
							aria-pressed={on()}
							aria-disabled={local.readOnly || undefined}
							title={r.label}
							class={`inline-flex items-center border motion-safe:transition-all motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${pillSize[local.size ?? "md"]} ${radiusMap[local.radius ?? "full"]} ${
								on()
									? "border-primary bg-primary/10 text-primary"
									: `border-border bg-surface text-foreground ${local.readOnly ? "cursor-default" : "hover:border-primary/50 hover:bg-muted/50"}`
							}`}
							onClick={() => toggle(r.key, !on())}
						>
							{r.icon}
							{r.count !== undefined && (local.showCounts ?? true) && (
								<span class="text-2xs font-medium tabular-nums">{r.count}</span>
							)}
						</button>
					);
				}}
			</For>
			<Show when={overflow() > 0}>
				<span class={`text-muted-foreground ${local.size === "sm" ? "text-2xs" : "text-xs"}`}>+{overflow()}</span>
			</Show>
		</div>
	);
}
