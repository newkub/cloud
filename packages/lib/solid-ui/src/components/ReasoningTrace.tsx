/**
 * ReasoningTrace - collapsible "thinking" block for chain-of-thought / agent steps.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface ReasoningStep {
	/** Step text. */
	text: string;
	/** Optional duration label, e.g. "1.2s". */
	duration?: string;
}

export interface ReasoningTraceProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Reasoning steps. */
	steps: ReasoningStep[];
	/** Header label. @default "Thinking" */
	label?: string;
	/** Currently reasoning — shows pulsing dot. @default false */
	active?: boolean;
	/** Start expanded. @default false */
	defaultOpen?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

export function ReasoningTrace(props: ReasoningTraceProps) {
	const [local, rest] = splitProps(props, ["class", "steps", "label", "active", "defaultOpen", "radius"]);
	const [open, setOpen] = createSignal(local.defaultOpen ?? false);

	const className = () =>
		[
			"solidui-reasoning-trace border border-border bg-muted/40 text-sm",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<button
				type="button"
				class="flex w-full items-center gap-2 px-3 py-2 text-left text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				aria-expanded={open()}
				onClick={() => setOpen((v) => !v)}
			>
				<Show when={local.active} fallback={<NamedIcon name="sparkles" class="h-3.5 w-3.5" />}>
					<span class="h-2 w-2 rounded-full bg-primary animate-pulse" />
				</Show>
				<span class="flex-1">{local.label ?? "Thinking"}</span>
				<NamedIcon name="chevron-down" class={`h-3.5 w-3.5 transition-transform ${open() ? "rotate-180" : ""}`} />
			</button>
			<Show when={open()}>
				<ol class="space-y-1.5 border-t border-border px-3 py-2 text-muted-foreground">
					<For each={local.steps}>
						{(s, i) => (
							<li class="flex items-start gap-2 text-xs">
								<span class="mt-0.5 text-[10px] tabular-nums text-muted-foreground/70">{i() + 1}.</span>
								<span class="flex-1">{s.text}</span>
								{s.duration ? <span class="text-[10px] tabular-nums">{s.duration}</span> : null}
							</li>
						)}
					</For>
				</ol>
			</Show>
		</div>
	);
}
