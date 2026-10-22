/**
 * PromptSuggestions - row/grid of starter prompt chips for AI chat empty states.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface PromptSuggestion {
	/** Suggestion id. */
	id: string;
	/** Prompt text shown on the chip. */
	label: string;
	/** Optional short description. */
	description?: string;
}

export interface PromptSuggestionsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Suggestion chips. */
	suggestions: PromptSuggestion[];
	/** Called with the picked suggestion. */
	onSelect?: (s: PromptSuggestion) => void;
	/** Two-column card layout instead of chips. @default false */
	cards?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

export function PromptSuggestions(props: PromptSuggestionsProps) {
	const [local, rest] = splitProps(props, ["class", "suggestions", "onSelect", "cards", "radius"]);

	const className = () =>
		["solidui-prompt-suggestions", local.cards ? "grid grid-cols-2 gap-2" : "flex flex-wrap gap-2", local.class ?? ""]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<For each={local.suggestions}>
				{(s) => (
					<button
						type="button"
						class={`border border-border bg-card text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "md"]} ${
							local.cards ? "p-3" : "px-3 py-1.5"
						}`}
						onClick={() => local.onSelect?.(s)}
					>
						<span class="block text-sm text-foreground">{s.label}</span>
						{local.cards && s.description ? (
							<span class="mt-0.5 block text-xs text-muted-foreground">{s.description}</span>
						) : null}
					</button>
				)}
			</For>
		</div>
	);
}
