/**
 * PlaygroundCard - editable code pane with a live preview area and a reset button.
 */

import { createSignal, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";
import { Textarea } from "./Textarea";

export interface PlaygroundCardProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Initial code — also the value the reset button restores. */
	code: string;
	/** Live preview renderer for the current draft. */
	preview: (code: string) => JSX.Element;
	/** Called with the draft after every edit. */
	onChange?: (code: string) => void;
	/** Card title. @default "Playground" */
	title?: string;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function PlaygroundCard(props: PlaygroundCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"code",
		"preview",
		"onChange",
		"title",
		"variant",
		"radius",
		"unstyled",
	]);
	const [draft, setDraft] = createSignal(local.code);

	const update = (next: string) => {
		setDraft(next);
		local.onChange?.(next);
	};

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: [
					"solidui-playground-card overflow-hidden border",
					surfaceVariants[local.variant ?? "default"],
					radiusMap[local.radius ?? "xl"],
					local.class ?? "",
				]
					.filter(Boolean)
					.join(" ");

	return (
		<div class={className()} {...rest}>
			<div class="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5">
				<span class="text-xs font-medium text-muted-foreground">{local.title ?? "Playground"}</span>
				<button
					type="button"
					onClick={() => update(local.code)}
					class="inline-flex h-7 items-center rounded border border-border bg-background px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				>
					Reset
				</button>
			</div>
			<div class="grid sm:grid-cols-2">
				<Textarea
					value={draft()}
					onChange={update}
					resize="vertical"
					aria-label="Playground code"
					class="min-h-28 rounded-none border-0 font-mono shadow-none focus-visible:ring-0"
				/>
				<div class="border-t border-border p-3 sm:border-l sm:border-t-0" data-testid="playground-preview">
					{local.preview?.(draft())}
				</div>
			</div>
		</div>
	);
}
