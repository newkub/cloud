/**
 * SignalBars — 5-bar signal strength indicator with weak/ok/great label and animated variant.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface SignalBarsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Signal strength, clamped to 0–4 filled bars */
	strength: number;
	/** Custom label — defaults to a strength word ("weak"/"ok"/"great") */
	label?: string;
	/** Pulse the lit bars @default false */
	animated?: boolean;
	/** Show the text label @default true */
	showLabel?: boolean;
}

const barHeights = ["h-1.5", "h-2.5", "h-3.5", "h-4.5", "h-5.5"] as const;

const strengthLabel = (strength: number) => {
	if (strength <= 0) return "No signal";
	if (strength <= 2) return "Weak";
	if (strength === 3) return "OK";
	return "Great";
};

export function SignalBars(props: SignalBarsProps) {
	const [local, rest] = splitProps(props, ["class", "strength", "label", "animated", "showLabel"]);
	const clamped = () => Math.max(0, Math.min(4, Math.round(local.strength)));
	const text = () => local.label ?? strengthLabel(clamped());

	return (
		<div class={`solidui-signal-bars inline-flex items-end gap-2 ${local.class ?? ""}`.trim()} {...rest}>
			<div
				class="flex items-end gap-0.5"
				role="img"
				aria-label={`Signal strength: ${text()} (${clamped()} of ${barHeights.length} bars)`}
			>
				<For each={barHeights}>
					{(height, i) => (
						<span
							aria-hidden="true"
							class={`w-1.5 rounded-sm ${height} ${
								i() < clamped() ? "bg-primary" : "bg-muted"
							} ${local.animated && i() < clamped() ? "motion-safe:animate-pulse" : ""}`}
							style={local.animated ? { "animation-delay": `${i() * 120}ms` } : undefined}
						/>
					)}
				</For>
			</div>
			<Show when={local.showLabel ?? true}>
				<span class="text-xs font-medium text-muted-foreground">{text()}</span>
			</Show>
		</div>
	);
}
