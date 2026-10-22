/**
 * ContextWindowBar - segmented context-window usage bar with warning tone near the limit.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

const sizeMap: Record<"sm" | "md" | "lg", string> = {
	sm: "text-2xs",
	md: "text-xs",
	lg: "text-sm",
};

export interface ContextWindowBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Tokens used. @default 64000 */
	used?: number;
	/** Context window size in tokens. @default 128000 */
	limit?: number;
	/** Model name shown next to the label. */
	model?: string;
	/** Ratio at which the bar turns to warning. @default 0.8 */
	warnAt?: number;
	/** Ratio at which the bar turns destructive. @default 0.95 */
	criticalAt?: number;
	/** Number of segments in the bar. @default 24 */
	segments?: number;
	size?: "sm" | "md" | "lg";
	/** Corner radius of the whole bar track. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function ContextWindowBar(props: ContextWindowBarProps) {
	const [local, rest] = splitProps(props, ["used", "limit", "model", "warnAt", "criticalAt", "segments", "children"]);
	const { className, rest: dom } = useComponentClasses(rest, {
		base: "solidui-context-window-bar",
		unstyled: props.unstyled,
		sizes: sizeMap,
		defaultSize: "md",
		axes: [{ prop: "radius", map: radiusMap, default: "md" }],
	});

	const used = () => local.used ?? 64000;
	const limit = () => Math.max(1, local.limit ?? 128000);
	const ratio = () => Math.min(1, Math.max(0, used() / limit()));
	const pct = () => Math.round(ratio() * 100);
	const count = () => Math.max(1, local.segments ?? 24);
	const filled = () => Math.round(ratio() * count());
	const tone = () =>
		ratio() >= (local.criticalAt ?? 0.95)
			? "bg-destructive"
			: ratio() >= (local.warnAt ?? 0.8)
				? "bg-warning"
				: "bg-primary";

	return (
		// biome-ignore lint/a11y/useSemanticElements: APG meter role requires aria-valuenow on a generic element
		<div
			class={className()}
			role="meter"
			aria-valuenow={used()}
			aria-valuemin={0}
			aria-valuemax={limit()}
			aria-valuetext={`${pct()}% of context window used`}
			aria-label={local.model ? `Context window usage for ${local.model}` : "Context window usage"}
			{...dom}
		>
			<div class="mb-1 flex items-baseline gap-2">
				<span class="font-medium text-foreground">Context</span>
				{local.model ? <span class="truncate text-muted-foreground">{local.model}</span> : null}
				<span class="ml-auto tabular-nums text-muted-foreground">
					{used().toLocaleString()}/{limit().toLocaleString()}
				</span>
				<span
					class={`w-10 text-right font-semibold tabular-nums ${ratio() >= (local.warnAt ?? 0.8) ? "text-warning" : "text-foreground"}`}
				>
					{pct()}%
				</span>
			</div>
			<div class={`flex gap-0.5 overflow-hidden bg-transparent ${radiusMap[props.radius ?? "md"]}`} aria-hidden="true">
				<For each={Array.from({ length: count() }, (_, i) => i)}>
					{(i) => (
						<span
							class={`h-2 flex-1 rounded-[2px] transition-colors motion-reduce:transition-none ${i < filled() ? tone() : "bg-muted"}`}
						/>
					)}
				</For>
			</div>
		</div>
	);
}
