/**
 * CopyButton — copies a value to the clipboard with check feedback.
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CopyButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Text copied to the clipboard */
	value: string;
	/** Idle label @default "Copy" */
	label?: string;
	/** Label shown after a successful copy @default "Copied" */
	copiedLabel?: string;
	/** Feedback duration in ms @default 1600 */
	timeout?: number;
	/** Hide the labels and show icon only @default false */
	iconOnly?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

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

export function CopyButton(props: CopyButtonProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"label",
		"copiedLabel",
		"timeout",
		"iconOnly",
		"onClick",
		"radius",
		"elevation",
		"fullWidth",
	]);
	const { copy: copyText, copied } = useCopyToClipboard(local.timeout ?? 1600);

	const copy = async (e: MouseEvent) => {
		(local.onClick as ((ev: MouseEvent) => void) | undefined)?.(e);
		await copyText(local.value);
	};

	return (
		<button
			type="button"
			class={`solidui-copy-button inline-flex min-h-9 items-center gap-1.5 border border-border bg-background px-2 py-1 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${copied() ? "text-success" : "text-muted-foreground hover:text-foreground"} ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.fullWidth ? "w-full" : ""} ${local.class ?? ""}`.trim()}
			aria-label={copied() ? (local.copiedLabel ?? "Copied") : (local.label ?? "Copy")}
			aria-live="polite"
			onClick={copy}
			{...rest}
		>
			{copied() ? <CheckIcon /> : <CopyIcon />}
			{!local.iconOnly && (copied() ? (local.copiedLabel ?? "Copied") : (local.label ?? "Copy"))}
		</button>
	);
}
