/**
 * GuardrailBadge - chip showing a guardrail outcome (pass/warn/block) with icon and sr-only status.
 */
import { useComponentClasses } from "@wrikka/hooks";
import type { JSX } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { chipVariants, type Radius, radiusMap } from "../lib/variants";

export type GuardrailState = "pass" | "warn" | "block";

const stateIcon: Record<GuardrailState, string> = {
	pass: "check",
	warn: "flag",
	block: "shield",
};

const stateSrText: Record<GuardrailState, string> = {
	pass: "Guardrail passed:",
	warn: "Guardrail warning:",
	block: "Guardrail blocked:",
};

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "px-2 py-0.5 text-2xs",
	md: "px-2.5 py-0.5 text-xs",
	lg: "px-3 py-1 text-sm",
};

export interface GuardrailBadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Guardrail outcome. @default "pass" */
	state?: GuardrailState;
	/** Check name shown in the chip. @default "Guardrail" */
	label?: string;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function GuardrailBadge(props: GuardrailBadgeProps) {
	const { className, rest } = useComponentClasses(props, {
		base: "solidui-guardrail-badge inline-flex items-center gap-1.5 border font-semibold",
		unstyled: props.unstyled,
		sizes: sizeMap,
		defaultSize: "md",
		axes: [
			{
				prop: "state",
				map: { pass: chipVariants.success, warn: chipVariants.warning, block: chipVariants.destructive },
				default: "pass",
			},
			{ prop: "radius", map: radiusMap, default: "full" },
		],
	});

	const state = () => props.state ?? "pass";

	return (
		<span class={className()} {...rest}>
			<span class="sr-only">{stateSrText[state()]}</span>
			<NamedIcon name={stateIcon[state()]} class="h-3 w-3" aria-hidden="true" />
			<span>{props.label ?? "Guardrail"}</span>
		</span>
	);
}
