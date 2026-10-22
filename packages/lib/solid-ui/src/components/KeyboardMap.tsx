/**
 * KeyboardMap — mini keyboard layout with highlighted keys and labels.
 */
import { For, type JSX, splitProps } from "solid-js";

export interface KeyboardMapProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Key labels to highlight (matched case-insensitively) */
	keys?: string[];
	/** Keyboard layout @default "full" */
	layout?: "full" | "compact";
}

const FULL_ROWS: string[][] = [
	["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
	["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
	["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
	["A", "S", "D", "F", "G", "H", "J", "K", "L"],
	["Z", "X", "C", "V", "B", "N", "M"],
	["Ctrl", "Alt", "Space", "Alt", "Ctrl"],
];

const COMPACT_ROWS: string[][] = [
	["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
	["A", "S", "D", "F", "G", "H", "J", "K", "L"],
	["Z", "X", "C", "V", "B", "N", "M"],
	["Ctrl", "Alt", "Space", "Alt", "Ctrl"],
];

const keyWidth = (key: string) => {
	if (key === "Space") return "w-24";
	if (key === "Ctrl" || key === "Alt") return "w-10";
	if (key === "Esc" || key.startsWith("F")) return "w-7";
	return "w-8";
};

export function KeyboardMap(props: KeyboardMapProps) {
	const [local, rest] = splitProps(props, ["class", "keys", "layout"]);
	const rows = () => ((local.layout ?? "full") === "compact" ? COMPACT_ROWS : FULL_ROWS);
	const highlighted = () => new Set((local.keys ?? []).map((k) => k.toLowerCase()));
	const isHighlighted = (key: string) => highlighted().has(key.toLowerCase());
	const label = () =>
		(local.keys ?? []).length === 0
			? "Keyboard map"
			: `Keyboard map with ${(local.keys ?? []).length} highlighted keys`;

	return (
		// biome-ignore lint/a11y/useSemanticElements: generic key group, not a form fieldset
		<div
			role="group"
			aria-label={label()}
			class={`solidui-keyboard-map inline-flex flex-col gap-1 rounded-lg border border-border bg-surface p-2 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={rows()}>
				{(row) => (
					<div class="flex gap-1">
						<For each={row}>
							{(key) => (
								<kbd
									class={`flex h-8 items-center justify-center rounded border font-mono text-2xs font-medium ${keyWidth(key)} ${
										isHighlighted(key)
											? "border-primary bg-primary text-primary-foreground"
											: "border-border bg-muted text-muted-foreground"
									}`}
								>
									{key}
								</kbd>
							)}
						</For>
					</div>
				)}
			</For>
		</div>
	);
}
