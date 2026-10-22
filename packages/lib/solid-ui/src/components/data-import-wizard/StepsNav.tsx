import { type Accessor, For, Show } from "solid-js";
import { STEPS } from "./constants";

export interface StepsNavProps {
	step: Accessor<number>;
	/** Jump to a previous step — indices past the current step are ignored. */
	onJump: (index: number) => void;
	class?: string;
}

/** Ordered Upload → Map → Preview → Confirm step indicator. */
export function StepsNav(props: StepsNavProps) {
	return (
		<ol class={`flex items-center gap-2 border-b border-border ${props.class ?? ""}`}>
			<For each={[...STEPS]}>
				{(title, i) => (
					<li class="flex items-center gap-2">
						<button
							type="button"
							disabled={i() > props.step()}
							class={`flex items-center gap-2 ${i() < props.step() ? "cursor-pointer" : "cursor-default"} disabled:opacity-60`}
							aria-current={i() === props.step() ? "step" : undefined}
							onClick={() => props.onJump(i())}
						>
							<span
								class={`flex h-6 w-6 items-center justify-center rounded-full text-2xs font-semibold ${
									i() < props.step()
										? "bg-primary text-primary-foreground"
										: i() === props.step()
											? "border-2 border-primary text-primary"
											: "border border-border text-muted-foreground"
								}`}
							>
								{i() < props.step() ? "✓" : i() + 1}
							</span>
							<span
								class={`hidden text-xs font-medium sm:inline ${i() === props.step() ? "text-foreground" : "text-muted-foreground"}`}
							>
								{title}
							</span>
						</button>
						<Show when={i() < STEPS.length - 1}>
							<span class="mx-1 h-px w-6 bg-border" aria-hidden="true" />
						</Show>
					</li>
				)}
			</For>
		</ol>
	);
}
