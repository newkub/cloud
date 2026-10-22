/**
 * SuccessCheck — animated circle-draw check mark with an optional label.
 */
import { createSignal, type JSX, onMount, Show, splitProps } from "solid-js";

export interface SuccessCheckProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Label rendered next to the check. */
	label?: string;
	/** Icon size in pixels. @default 24 */
	size?: number;
}

export function SuccessCheck(props: SuccessCheckProps) {
	const [local, rest] = splitProps(props, ["class", "label", "size"]);
	const [drawn, setDrawn] = createSignal(false);
	onMount(() => setDrawn(true));
	const s = () => local.size ?? 24;
	return (
		<span
			role="status"
			class={`solidui-success-check inline-flex items-center gap-1.5 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<svg
				viewBox="0 0 24 24"
				width={s()}
				height={s()}
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="shrink-0 text-success"
				aria-hidden="true"
			>
				<circle
					cx="12"
					cy="12"
					r="10"
					pathLength={1}
					stroke-dasharray="1"
					stroke-dashoffset={drawn() ? 0 : 1}
					class="transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none"
				/>
				<path
					d="M8 12.5l3 3 5-6"
					pathLength={1}
					stroke-dasharray="1"
					stroke-dashoffset={drawn() ? 0 : 1}
					class="transition-[stroke-dashoffset] duration-300 delay-300 ease-out motion-reduce:transition-none"
				/>
			</svg>
			<Show when={local.label} fallback={<span class="sr-only">Success</span>}>
				<span class="text-sm text-foreground">{local.label}</span>
			</Show>
		</span>
	);
}
