/**
 * FieldGroup - consistent vertical rhythm for stacking labelled form controls.
 */
import { type JSX, splitProps } from "solid-js";

export interface FieldGroupProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Compact spacing between fields. @default false */
	compact?: boolean;
}

export function FieldGroup(props: FieldGroupProps) {
	const [local, rest] = splitProps(props, ["class", "compact", "children"]);

	const className = () =>
		["solidui-field-group flex flex-col", local.compact ? "gap-3" : "gap-5", local.class ?? ""]
			.filter(Boolean)
			.join(" ");

	return (
		// biome-ignore lint/a11y/useSemanticElements: generic field group, not a form fieldset
		<div class={className()} role="group" {...rest}>
			{local.children}
		</div>
	);
}
