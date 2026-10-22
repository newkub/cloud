/**
 * MathFormula — KaTeX-rendered math expression, inline or display.
 */
import katex from "katex";
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface MathFormulaProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** TeX source, e.g. "e^{i\\pi} + 1 = 0". */
	tex: string;
	/** Display (block, centered) vs inline. @default true */
	displayMode?: boolean;
	/** Label under the formula (equation number, caption). */
	caption?: string;
	size?: "sm" | "md" | "lg";
	/** Corner radius on the display wrapper. */
	radius?: Radius;
	/** Shadow elevation on the display wrapper. */
	elevation?: Elevation;
}

const textSize = { sm: "text-sm", md: "text-base", lg: "text-xl" } as const;

export function MathFormula(props: MathFormulaProps) {
	const [local, rest] = splitProps(props, ["class", "tex", "displayMode", "caption", "size", "radius", "elevation"]);
	const html = () => {
		try {
			return katex.renderToString(local.tex, { displayMode: local.displayMode ?? true, throwOnError: false });
		} catch {
			return local.tex;
		}
	};
	return (
		<div
			class={`solidui-math-formula text-foreground ${textSize[local.size ?? "md"]} ${
				(local.displayMode ?? true)
					? `overflow-x-auto border border-border bg-surface px-4 py-3 text-center ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""}`
					: "inline-block"
			} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{/* katex output is generated from tex — safe to inject */}
			<span innerHTML={html()} />
			<Show when={local.caption}>
				<div class="mt-1 text-2xs text-muted-foreground">{local.caption}</div>
			</Show>
		</div>
	);
}
