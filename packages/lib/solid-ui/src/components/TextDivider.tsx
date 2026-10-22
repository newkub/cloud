/**
 * TextDivider — horizontal rule with a centered label (e.g. "or").
 * @deprecated Use `Divider` with the `label` prop.
 */
import { type JSX, splitProps } from "solid-js";
import { Divider } from "./Divider";

export interface TextDividerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Label between the two rules. */
	label?: JSX.Element;
}

export function TextDivider(props: TextDividerProps) {
	const [local, rest] = splitProps(props, ["label", "children"]);
	return <Divider label={local.children ?? local.label} {...rest} />;
}
