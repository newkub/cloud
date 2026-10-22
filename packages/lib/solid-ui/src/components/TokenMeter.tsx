/**
 * TokenMeter - context-window usage meter (tokens used / max) for AI UIs.
 */
import { type JSX, splitProps } from "solid-js";

export interface TokenMeterProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Tokens used. */
	used?: number;
	/** Context window size. */
	max?: number;
	/** Model/context label. */
	label?: string;
	/** Warn threshold ratio. @default 0.8 */
	warnAt?: number;
}

export function TokenMeter(props: TokenMeterProps) {
	const [local, rest] = splitProps(props, ["class", "used", "max", "label", "warnAt"]);

	const ratio = () => Math.min(1, (local.max ?? 0) > 0 ? (local.used ?? 0) / (local.max ?? 1) : 0);
	const tone = () => (ratio() >= (local.warnAt ?? 0.8) ? "bg-warning" : "bg-primary");

	const className = () => ["solidui-token-meter flex items-center gap-2", local.class ?? ""].filter(Boolean).join(" ");

	return (
		// biome-ignore lint/a11y/useSemanticElements: APG meter role requires aria-valuenow on a generic element
		<div
			class={className()}
			role="meter"
			aria-valuenow={local.used ?? 0}
			aria-valuemin={0}
			aria-valuemax={local.max ?? 0}
			aria-label={local.label ?? "Token usage"}
			{...rest}
		>
			{local.label ? <span class="text-xs text-muted-foreground">{local.label}</span> : null}
			<span class="h-1.5 flex-1 min-w-[60px] overflow-hidden rounded-full bg-muted">
				<span class={`block h-full rounded-full transition-all ${tone()}`} style={{ width: `${ratio() * 100}%` }} />
			</span>
			<span class="text-xs tabular-nums text-muted-foreground">
				{(local.used ?? 0).toLocaleString()}/{(local.max ?? 0).toLocaleString()}
			</span>
		</div>
	);
}
