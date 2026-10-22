/**
 * TrackChange — inline suggestion mark for reviewed text. Insertions render
 * with a success underline, deletions struck through; accept/reject icon
 * buttons emit `onAccept` / `onReject`.
 */
import { type JSX, Show, splitProps } from "solid-js";

export interface TrackChangeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Suggestion kind — insertion or deletion. */
	type: "insert" | "delete";
	/** Called when the accept (check) button is clicked. */
	onAccept?: () => void;
	/** Called when the reject (cross) button is clicked. */
	onReject?: () => void;
	/** Hide the accept/reject buttons. @default false */
	readOnly?: boolean;
}

const iconBtn =
	"inline-flex h-4 w-4 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function TrackChange(props: TrackChangeProps) {
	const [local, rest] = splitProps(props, ["class", "type", "onAccept", "onReject", "readOnly", "children"]);
	const insert = () => local.type === "insert";

	return (
		// biome-ignore lint/a11y/useSemanticElements: inline suggestion mark — fieldset is not valid phrasing content
		<span
			role="group"
			aria-label={insert() ? "Suggested insertion" : "Suggested deletion"}
			class={`solidui-track-change inline-flex items-baseline gap-0.5 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<span
				class={
					insert()
						? "text-success underline decoration-success decoration-2 underline-offset-2"
						: "text-muted-foreground line-through decoration-destructive"
				}
			>
				{local.children}
			</span>
			<Show when={!local.readOnly}>
				<span class="inline-flex items-center gap-0.5">
					<button
						type="button"
						aria-label="Accept change"
						onClick={() => local.onAccept?.()}
						class={`${iconBtn} text-success hover:bg-success/10`}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							class="h-3 w-3"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7" />
						</svg>
					</button>
					<button
						type="button"
						aria-label="Reject change"
						onClick={() => local.onReject?.()}
						class={`${iconBtn} text-destructive hover:bg-destructive/10`}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							class="h-3 w-3"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12" />
						</svg>
					</button>
				</span>
			</Show>
		</span>
	);
}
