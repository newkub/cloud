import { Show } from "solid-js";
import type { ApiParameter } from "../../lib/api-spec";
import { IN_BADGE } from "./utils";

export function ParamRow(props: { p: ApiParameter }) {
	return (
		<div class="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-2 flex-wrap">
					<code class="text-sm font-mono font-semibold text-foreground">{props.p.name}</code>
					<span class={`text-2xs px-1.5 py-0.5 rounded border ${IN_BADGE[props.p.in] ?? IN_BADGE.query}`}>
						{props.p.in}
					</span>
					<Show when={props.p.required} fallback={<span class="text-2xs text-muted-foreground">optional</span>}>
						<span class="text-2xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">required</span>
					</Show>
				</div>
				<Show when={props.p.description}>
					<p class="text-xs text-muted-foreground m-0 mt-1 leading-relaxed">{props.p.description}</p>
				</Show>
			</div>
			<Show when={props.p.example != null}>
				<code class="text-2xs font-mono px-2 py-1 rounded bg-background border border-border text-muted-foreground shrink-0 max-w-40 truncate">
					{typeof props.p.example === "string" ? props.p.example : JSON.stringify(props.p.example)}
				</code>
			</Show>
		</div>
	);
}
