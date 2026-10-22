/**
 * Spoiler - clamps long content behind a show/hide toggle.
 */
import { createSignal, type JSX, splitProps } from "solid-js";
import { Button } from "./Button";

export interface SpoilerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Max height in px while collapsed. @default 120 */
	maxHeight?: number;
	/** Label when collapsed. @default "Show more" */
	showLabel?: string;
	/** Label when expanded. @default "Show less" */
	hideLabel?: string;
	/** Start expanded. @default false */
	defaultExpanded?: boolean;
}

export function Spoiler(props: SpoilerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"maxHeight",
		"showLabel",
		"hideLabel",
		"children",
		"defaultExpanded",
	]);
	const [expanded, setExpanded] = createSignal(local.defaultExpanded ?? false);

	const className = () => ["solidui-spoiler", local.class ?? ""].filter(Boolean).join(" ");

	return (
		<div class={className()} {...rest}>
			<div
				class="overflow-hidden transition-[max-height] motion-reduce:transition-none"
				style={{ "max-height": expanded() ? "none" : `${local.maxHeight ?? 120}px` }}
			>
				{local.children}
			</div>
			<Button variant="ghost" class="mt-1 h-7 px-2 text-xs" onClick={() => setExpanded((v) => !v)}>
				{expanded() ? (local.hideLabel ?? "Show less") : (local.showLabel ?? "Show more")}
			</Button>
		</div>
	);
}
