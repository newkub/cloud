/**
 * InputGroup - input with attached prefix/suffix addons (icon, text, or control).
 */
import { type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";
import { Input } from "./Input";

export interface InputGroupProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "prefix"> {
	/** Content rendered before the input inside the group. */
	prefix?: JSX.Element;
	/** Content rendered after the input inside the group. */
	suffix?: JSX.Element;
	/** Placeholder forwarded to the inner input. */
	placeholder?: string;
	/** Value forwarded to the inner input. */
	value?: string;
	/** Input type. @default "text" */
	type?: string;
	/** Disabled state forwarded to the inner input. */
	disabled?: boolean;
	/** Change handler for the inner input value. */
	onValueChange?: (value: string) => void;
	/** Corner radius. */
	radius?: Radius;
}

export function InputGroup(props: InputGroupProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"prefix",
		"suffix",
		"placeholder",
		"value",
		"type",
		"disabled",
		"onValueChange",
		"radius",
	]);

	const className = () =>
		[
			"solidui-input-group flex items-stretch overflow-hidden border border-input bg-background focus-within:ring-2 focus-within:ring-ring",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const addonClass = "inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border-border";

	return (
		<div class={className()} {...rest}>
			{local.prefix ? <span class={`${addonClass} border-r`}>{local.prefix}</span> : null}
			<Input
				class="flex-1 border-0 rounded-none focus-visible:ring-0"
				type={local.type ?? "text"}
				placeholder={local.placeholder}
				value={local.value}
				disabled={local.disabled}
				onInput={(e) => local.onValueChange?.(e.currentTarget.value)}
			/>
			{local.suffix ? <span class={`${addonClass} border-l`}>{local.suffix}</span> : null}
		</div>
	);
}
