/**
 * EnvBadge - environment chip (production / staging / preview / development).
 */
import { type JSX, splitProps } from "solid-js";
import { Badge } from "./Badge";

export type EnvName = "production" | "staging" | "preview" | "development" | string;

export interface EnvBadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Environment name — drives the color. */
	env: EnvName;
	/** Custom label; defaults to env name. */
	label?: string;
}

const tone: Record<string, string> = {
	production: "bg-destructive/15 text-destructive border-destructive/30",
	staging: "bg-warning/15 text-warning border-warning/30",
	preview: "bg-info/15 text-info border-info/30",
	development: "bg-success/15 text-success border-success/30",
};

export function EnvBadge(props: EnvBadgeProps) {
	const [local, rest] = splitProps(props, ["class", "env", "label", "children"]);

	const className = () =>
		["solidui-env-badge", tone[local.env] ?? "bg-muted text-muted-foreground border-border", local.class ?? ""]
			.filter(Boolean)
			.join(" ");

	return (
		<Badge variant="outline" class={className()} {...rest}>
			{local.children ?? local.label ?? local.env}
		</Badge>
	);
}
