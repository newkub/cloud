/**
 * BlockHandle — hover drag-grip + plus button for editor blocks. The plus
 * button emits "add"; clicking the grip opens a mini menu with
 * duplicate / turn-into / delete actions.
 */

import { useClickOutside, useEscapeKey } from "@wrikka/hooks";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export type BlockHandleAction = "add" | "duplicate" | "turn-into" | "delete";

const menuItems: { action: BlockHandleAction; label: string; danger?: boolean }[] = [
	{ action: "duplicate", label: "Duplicate" },
	{ action: "turn-into", label: "Turn into…" },
	{ action: "delete", label: "Delete", danger: true },
];

const iconBtn =
	"inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export interface BlockHandleProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Called with the chosen action (add, duplicate, turn-into, delete). */
	onAction?: (action: BlockHandleAction) => void;
	/** Corner radius of the mini menu. */
	radius?: Radius;
}

export function BlockHandle(props: BlockHandleProps) {
	const [local, rest] = splitProps(props, ["class", "onAction", "radius"]);
	const [open, setOpen] = createSignal(false);
	let rootEl: HTMLDivElement | undefined;

	useClickOutside(
		() => rootEl,
		() => setOpen(false),
		{ events: ["pointerdown"] },
	);
	useEscapeKey(() => setOpen(false));

	const pick = (action: BlockHandleAction) => {
		setOpen(false);
		local.onAction?.(action);
	};

	return (
		<div
			ref={rootEl}
			class={`solidui-block-handle relative inline-flex items-center gap-0.5 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<button type="button" aria-label="Add block below" onClick={() => pick("add")} class={iconBtn}>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="h-3.5 w-3.5"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
				</svg>
			</button>
			<button
				type="button"
				aria-label="Block options"
				aria-haspopup="menu"
				aria-expanded={open()}
				draggable
				onClick={() => setOpen((v) => !v)}
				class={`${iconBtn} cursor-grab active:cursor-grabbing`}
			>
				<svg viewBox="0 0 24 24" fill="currentColor" class="h-3.5 w-3.5" aria-hidden="true">
					<circle cx="9" cy="6" r="1.4" />
					<circle cx="15" cy="6" r="1.4" />
					<circle cx="9" cy="12" r="1.4" />
					<circle cx="15" cy="12" r="1.4" />
					<circle cx="9" cy="18" r="1.4" />
					<circle cx="15" cy="18" r="1.4" />
				</svg>
			</button>
			<Show when={open()}>
				<div
					role="menu"
					aria-label="Block actions"
					class={`absolute left-0 top-full z-dropdown mt-1 min-w-36 border border-border bg-surface p-1 shadow-lg ${radiusMap[local.radius ?? "md"]}`}
				>
					<For each={menuItems}>
						{(item) => (
							<button
								type="button"
								role="menuitem"
								onClick={() => pick(item.action)}
								class={`flex w-full items-center rounded px-2.5 py-1.5 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
									item.danger ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-muted"
								}`}
							>
								{item.label}
							</button>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
