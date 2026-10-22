import { createSignal, Show } from "solid-js";
import { JsonBlock } from "./JsonBlock";
import { statusClass } from "./utils";

export function ResponseRow(props: { code: string; description: string; example?: unknown }) {
	const [open, setOpen] = createSignal(false);
	return (
		<div class="border-b border-border/50 last:border-0">
			<button
				type="button"
				onClick={() => props.example != null && setOpen(!open())}
				aria-expanded={open()}
				class="w-full flex items-center gap-3 px-1 py-2.5 text-left cursor-pointer border-none bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
			>
				<span
					class={`inline-flex items-center justify-center min-w-12 px-2 py-0.5 rounded-md border text-xs font-bold font-mono ${statusClass(props.code)}`}
				>
					{props.code}
				</span>
				<span class="text-sm text-muted-foreground flex-1">{props.description}</span>
				<Show when={props.example != null}>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class={`h-3.5 w-3.5 text-muted-foreground transition-transform motion-reduce:transition-none ${open() ? "rotate-180" : ""}`}
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
					</svg>
				</Show>
			</button>
			<Show when={open() && props.example != null}>
				<div class="pb-3">
					<JsonBlock value={props.example} />
				</div>
			</Show>
		</div>
	);
}
