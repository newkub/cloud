/**
 * WaveDivider — SVG wave/curve section separator.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type JSX, splitProps } from "solid-js";

export type WaveDividerVariant = "default" | "surface" | "muted" | "primary" | "accent";

const variantMap: Record<WaveDividerVariant, string> = {
	default: "text-muted",
	surface: "text-surface",
	muted: "text-muted-foreground",
	primary: "text-primary",
	accent: "text-accent",
};

export interface WaveDividerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Fill tone (maps to a semantic text color). @default "default" */
	variant?: WaveDividerVariant;
	/** Flip vertically — use at the bottom of a section. @default false */
	flip?: boolean;
	/** Wave height in px. @default 48 */
	height?: number;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function WaveDivider(props: WaveDividerProps) {
	const [local, pass] = splitProps(props, ["height"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "block w-full overflow-hidden leading-none",
		variants: variantMap,
		defaultVariant: "default",
		unstyled: props.unstyled,
		axes: [{ prop: "flip", map: { true: "rotate-180" } }],
	});
	return (
		<div
			class={className()}
			style={local.height !== undefined ? { height: `${local.height}px` } : undefined}
			aria-hidden="true"
			{...rest}
		>
			<svg
				class={`h-full w-full fill-current ${local.height === undefined ? "min-h-12" : ""}`}
				viewBox="0 0 1440 100"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<path d="M0,50 C240,110 480,0 720,50 C960,100 1200,10 1440,50 L1440,100 L0,100 Z" />
			</svg>
		</div>
	);
}
