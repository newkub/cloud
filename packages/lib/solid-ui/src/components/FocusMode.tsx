/**
 * FocusMode — fullscreen dim overlay that spotlights a target region. While
 * `active`, children render inside an outlined focus area above a scrim;
 * clicking the scrim or pressing Escape calls `onExit`.
 */

import { useEscapeKey } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, type ScrimVariant, scrimVariants } from "../lib/variants";

export interface FocusModeProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Whether the overlay is shown. @default false */
	active?: boolean;
	/** Called on Escape, scrim click or the close button. */
	onExit?: () => void;
	/** Content rendered inside the highlighted focus region. */
	children?: JSX.Element;
	/** Accessible label for the dialog. @default "Focus mode" */
	label?: string;
	/** Scrim dim level. @default "dim" */
	scrim?: ScrimVariant;
	/** Corner radius of the focus outline. */
	radius?: Radius;
}

export function FocusMode(props: FocusModeProps) {
	const [local, rest] = splitProps(props, ["class", "active", "onExit", "children", "label", "scrim", "radius"]);

	useEscapeKey(
		(e) => {
			e.preventDefault();
			local.onExit?.();
		},
		{ when: () => !!local.active },
	);

	return (
		<Show when={local.active}>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={local.label ?? "Focus mode"}
				class={`solidui-focus-mode fixed inset-0 z-50 flex items-center justify-center ${local.class ?? ""}`.trim()}
				{...rest}
			>
				<button
					type="button"
					aria-label="Exit focus mode"
					onClick={() => local.onExit?.()}
					class={`absolute inset-0 cursor-default ${scrimVariants[local.scrim ?? "dim"]}`}
				/>
				<div
					class={`relative z-10 max-w-[80%] bg-surface p-4 shadow-2xl ring-2 ring-primary ${radiusMap[local.radius ?? "lg"]}`}
				>
					{local.children}
				</div>
				<button
					type="button"
					aria-label="Close focus mode"
					onClick={() => local.onExit?.()}
					class="absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface text-muted-foreground shadow-md transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="h-4 w-4"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
		</Show>
	);
}
