/**
 * Terminal component for displaying command output
 */
import { createEffect, createSignal, For, type JSX, mergeProps, onCleanup, Show } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const surfaceMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-background shadow-sm",
};

export interface TerminalLine {
	prefix?: string;
	content: string;
	variant?: "default" | "success" | "error" | "warning" | "muted";
}

export interface TerminalProps {
	title?: string;
	lines?: TerminalLine[];
	children?: JSX.Element;
	typing?: boolean;
	typingSpeed?: number;
	showPrompt?: boolean;
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	class?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const variantClass: Record<Exclude<TerminalLine["variant"], undefined>, string> = {
	default: "text-foreground",
	success: "text-success",
	error: "text-destructive",
	warning: "text-warning",
	muted: "text-muted-foreground",
};

export function Terminal(props: TerminalProps) {
	const merged = mergeProps({ title: "bash — zsh", typing: false, typingSpeed: 40, showPrompt: false }, props);
	const [visible, setVisible] = createSignal(props.typing ? 0 : (props.lines?.length ?? 0));

	createEffect(() => {
		if (!merged.typing || !props.lines) {
			setVisible(props.lines?.length ?? 0);
			return;
		}
		setVisible(0);
		let index = 0;
		const timer = setInterval(() => {
			index++;
			setVisible(index);
			if (index >= (props.lines?.length ?? 0)) clearInterval(timer);
		}, merged.typingSpeed);
		onCleanup(() => clearInterval(timer));
	});

	return (
		<div
			class={`overflow-hidden border font-mono text-sm ${surfaceMap[merged.variant ?? "default"]} ${radiusMap[merged.radius ?? "xl"]} ${merged.elevation ? elevationMap[merged.elevation] : ""} ${merged.class ?? ""}`}
		>
			<div class="flex items-center gap-2 border-b border-border bg-surface px-4 py-2">
				<div class="flex items-center gap-1.5" aria-hidden="true">
					<span class="h-3 w-3 rounded-full bg-destructive" />
					<span class="h-3 w-3 rounded-full bg-warning" />
					<span class="h-3 w-3 rounded-full bg-success" />
				</div>
				<span class="ml-2 min-w-0 truncate text-xs text-muted-foreground">{merged.title}</span>
			</div>
			<div class={`max-h-96 space-y-1 overflow-y-auto ${paddingSizes[merged.size ?? "md"]}`}>
				<For each={props.lines?.slice(0, visible())}>
					{(line) => (
						<div class={`whitespace-pre-wrap break-words ${variantClass[line.variant ?? "default"]}`}>
							<Show when={merged.showPrompt || line.prefix}>
								<span class="mr-2 text-muted-foreground">{line.prefix ?? "$"}</span>
							</Show>
							{line.content}
						</div>
					)}
				</For>
				<Show when={merged.typing && visible() < (props.lines?.length ?? 0)}>
					<span class="inline-block h-4 w-2 motion-safe:animate-pulse bg-primary" />
				</Show>
				{merged.children}
			</div>
		</div>
	);
}
