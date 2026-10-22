/**
 * KbdGroup — inline row of Kbd elements joined by a separator (default "+").
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show } from "solid-js";

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "gap-1 text-xs",
	md: "gap-1.5 text-sm",
	lg: "gap-2 text-base",
};

export interface KbdGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Element rendered between adjacent children. @default "+" */
	separator?: JSX.Element;
	size?: "sm" | "md" | "lg";
}

export function KbdGroup(props: KbdGroupProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-kbd-group inline-flex flex-wrap items-center font-medium",
		sizes: sizeMap,
		defaultSize: "md",
	});
	const items = () => {
		const c = props.children as JSX.Element | JSX.Element[];
		return (Array.isArray(c) ? c : [c]).filter((x) => x !== undefined && x !== null);
	};
	return (
		// biome-ignore lint/a11y/useSemanticElements: shortcut key grouping, not a form fieldset
		<div role="group" aria-label="keyboard shortcut" class={className()} {...rest}>
			<For each={items()}>
				{(child, index) => (
					<>
						<Show when={index() > 0}>{props.separator ?? "+"}</Show>
						{child}
					</>
				)}
			</For>
		</div>
	);
}
