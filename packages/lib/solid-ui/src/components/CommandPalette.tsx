/**
 * CommandPalette - modal searchable command list.
 */

import { createFocusTrap, useEscapeKey } from "@wrikka/hooks";
import { createEffect, createSignal, mergeProps, onCleanup, onMount, Show } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";
import { Command, type CommandItem } from "./Command";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-surface shadow-xl",
};

export interface CommandPaletteProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	items?: CommandItem[];
	placeholder?: string;
	emptyText?: string;
	onSelect?: (item: CommandItem) => void;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
	class?: string;
	/** Corner radius. @default "xl" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const DEFAULT_COMMAND_PALETTE_PROPS = {
	open: false,
	items: [] as CommandItem[],
	placeholder: "Type a command or search…",
	emptyText: "No commands found.",
};

interface CommandPaletteContentProps {
	setOpen: (value: boolean) => void;
	class?: string;
	variant?: CommandPaletteProps["variant"];
	size?: CommandPaletteProps["size"];
	radius?: CommandPaletteProps["radius"];
	elevation?: CommandPaletteProps["elevation"];
	items?: CommandItem[];
	placeholder?: string;
	emptyText?: string;
	onSelect?: (item: CommandItem) => void;
}

function useCommandPaletteState(props: CommandPaletteProps) {
	const merged = mergeProps(DEFAULT_COMMAND_PALETTE_PROPS, props);
	const [internalOpen, setInternalOpen] = createSignal(merged.open);
	function setOpen(value: boolean) {
		setInternalOpen(value);
		props.onOpenChange?.(value);
	}
	createEffect(() => setInternalOpen(merged.open));
	return { merged, internalOpen, setOpen };
}

function useCommandPaletteShortcuts(setOpen: (value: boolean) => void, isOpen: () => boolean) {
	useEscapeKey(() => setOpen(false), { when: isOpen });
	onMount(() => {
		function onKeyDown(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen(!isOpen());
			}
		}
		document.addEventListener("keydown", onKeyDown);
		onCleanup(() => document.removeEventListener("keydown", onKeyDown));
	});
}

function CommandPaletteContent(localProps: CommandPaletteContentProps) {
	let contentRef: HTMLDivElement | undefined;

	onMount(() => {
		const trap = contentRef ? createFocusTrap(contentRef) : null;
		trap?.activate();
		onCleanup(() => trap?.deactivate());
	});

	return (
		<div
			ref={(el) => (contentRef = el)}
			class="fixed inset-0 z-modal bg-overlay/60 p-4 backdrop-blur-sm motion-safe:animate-[su-fade-in_var(--su-transition-fast)]"
			onClick={() => localProps.setOpen(false)}
			onKeyDown={(e) => {
				if (e.key === "Escape") localProps.setOpen(false);
			}}
			role="dialog"
			aria-modal="true"
			aria-label="Command palette"
			tabIndex={-1}
		>
			<div
				class={`mx-auto mt-16 w-full max-w-lg border ${variantMap[localProps.variant ?? "default"]} ${paddingSizes[localProps.size ?? "xs"]} ${radiusMap[localProps.radius ?? "xl"]} ${localProps.elevation ? elevationMap[localProps.elevation] : ""} ${localProps.class ?? ""}`}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				role="document"
				tabIndex={-1}
			>
				<Command
					items={localProps.items}
					placeholder={localProps.placeholder}
					emptyText={localProps.emptyText}
					onSelect={(item) => {
						item.onSelect?.();
						localProps.onSelect?.(item);
						localProps.setOpen(false);
					}}
				/>
			</div>
		</div>
	);
}

export function CommandPalette(props: CommandPaletteProps) {
	const { merged, internalOpen, setOpen } = useCommandPaletteState(props);
	useCommandPaletteShortcuts(setOpen, internalOpen);

	return (
		<Show when={internalOpen()}>
			<CommandPaletteContent
				setOpen={setOpen}
				class={props.class}
				variant={props.variant}
				size={props.size}
				radius={props.radius}
				elevation={props.elevation}
				items={merged.items}
				placeholder={merged.placeholder}
				emptyText={merged.emptyText}
				onSelect={props.onSelect}
			/>
		</Show>
	);
}
