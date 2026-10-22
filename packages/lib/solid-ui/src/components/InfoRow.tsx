/**
 * InfoRow — icon + label + value row with an optional copy-to-clipboard button.
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";

export interface InfoRowProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Row label */
	label: string;
	/** Row value — any element; its text is used when copying */
	value: JSX.Element;
	/** Decorative icon rendered before the label */
	icon?: JSX.Element;
	/** Show a copy button that copies the value's text @default false */
	copyable?: boolean;
	/** Render the value in a monospace font @default false */
	mono?: boolean;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
}

const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const;
const rowPad = { sm: "py-1.5", md: "py-2", lg: "py-3" } as const;

const CopyIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="h-3.5 w-3.5"
		aria-hidden="true"
	>
		<rect x="9" y="9" width="13" height="13" rx="2" />
		<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
	</svg>
);

const CheckIcon = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="h-3.5 w-3.5"
		aria-hidden="true"
	>
		<path d="M20 6 9 17l-5-5" />
	</svg>
);

export function InfoRow(props: InfoRowProps) {
	const [local, rest] = splitProps(props, ["class", "label", "value", "icon", "copyable", "mono", "size"]);
	const { copy: copyText, copied } = useCopyToClipboard();
	let valueEl: HTMLSpanElement | undefined;

	const copy = () => void copyText(valueEl?.textContent ?? "");

	return (
		<div
			class={`solidui-info-row flex items-center gap-2 ${rowPad[local.size ?? "md"]} ${textSize[local.size ?? "md"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.icon}>
				<span class="shrink-0 text-muted-foreground" aria-hidden="true">
					{local.icon}
				</span>
			</Show>
			<span class="shrink-0 text-muted-foreground">{local.label}</span>
			<span
				ref={(el) => {
					valueEl = el;
				}}
				class={`ml-auto min-w-0 truncate text-right font-medium text-foreground ${local.mono ? "font-mono tabular-nums" : ""}`}
			>
				{local.value}
			</span>
			<Show when={local.copyable}>
				<button
					type="button"
					class={`inline-flex shrink-0 items-center gap-1 rounded px-1 py-0.5 text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring motion-reduce:transition-none ${copied() ? "text-success" : "text-muted-foreground hover:text-foreground"}`}
					aria-label={copied() ? "Copied" : `Copy ${local.label}`}
					aria-live="polite"
					onClick={copy}
				>
					{copied() ? <CheckIcon /> : <CopyIcon />}
					<Show when={copied()}>
						<span>Copied</span>
					</Show>
				</button>
			</Show>
		</div>
	);
}
