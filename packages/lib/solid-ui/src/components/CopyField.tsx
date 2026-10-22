/**
 * CopyField - read-only value with an attached copy-to-clipboard button.
 */
import { type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";
import { CopyButton } from "./CopyButton";

export interface CopyFieldProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** The value displayed and copied. */
	value: string;
	/** Accessible label. @default "Copy value" */
	label?: string;
	/** Corner radius. */
	radius?: Radius;
}

export function CopyField(props: CopyFieldProps) {
	const [local, rest] = splitProps(props, ["class", "value", "label", "radius"]);

	const className = () =>
		[
			"solidui-copy-field flex items-center overflow-hidden border border-input bg-muted",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<code class="flex-1 truncate px-3 py-2 text-sm font-mono text-foreground select-all">{local.value}</code>
			<CopyButton
				class="border-l border-border rounded-none h-full px-3"
				value={local.value}
				aria-label={local.label ?? "Copy value"}
			/>
		</div>
	);
}
