import { useCopyToClipboard } from "@wrikka/hooks";
import { Show } from "solid-js";

export function CopyButton(props: { text: () => string; label?: string }) {
	const { copy, copied } = useCopyToClipboard(1500);
	return (
		<button
			type="button"
			onClick={() => void copy(props.text())}
			class="px-2 h-6 inline-flex items-center gap-1 rounded text-2xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer border-none bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
		>
			<Show
				when={copied()}
				fallback={
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="h-3 w-3"
						aria-hidden="true"
					>
						<rect x="9" y="9" width="12" height="12" rx="2" />
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
					</svg>
				}
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					class="h-3 w-3 text-success"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
				</svg>
			</Show>
			{copied() ? "Copied" : (props.label ?? "Copy")}
		</button>
	);
}
