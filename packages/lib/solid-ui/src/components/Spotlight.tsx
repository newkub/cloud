/**
 * Spotlight - full-screen search overlay.
 */

import { useEscapeKey } from "@wrikka/hooks";
import { type JSX, mergeProps, Show, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { scrimVariants } from "../lib/variants";

export interface SpotlightProps extends JSX.HTMLAttributes<HTMLDivElement> {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Scrim style behind the spotlight content. */
	variant?: keyof typeof scrimVariants;
}

function SpotlightContent(props: SpotlightProps) {
	const [local, rest] = splitProps(props, ["class", "children", "onOpenChange", "variant"]);

	useEscapeKey(() => local.onOpenChange?.(false));

	return (
		<Portal>
			<div
				class={`pointer-events-auto fixed inset-0 z-modal ${scrimVariants[local.variant ?? "default"]} motion-safe:animate-[su-fade-in_var(--su-transition-normal)] ${local.class ?? ""}`}
				onClick={() => local.onOpenChange?.(false)}
				aria-hidden="true"
			/>
			<Show when={local.children}>
				<div class="pointer-events-none fixed inset-0 z-modal flex items-center justify-center p-4" {...rest}>
					<div class="pointer-events-auto max-h-full max-w-full">{local.children}</div>
				</div>
			</Show>
		</Portal>
	);
}

export function Spotlight(props: SpotlightProps) {
	const merged = mergeProps({ open: false }, props);
	return (
		<Show when={merged.open}>
			<SpotlightContent {...merged} />
		</Show>
	);
}
