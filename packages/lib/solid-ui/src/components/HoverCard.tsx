/**
 * Hover-triggered popover card
 */
import { createSignal, createUniqueId, type JSX, mergeProps, onCleanup, Show, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-surface shadow-md",
};

export interface HoverCardProps {
	children?: JSX.Element;
	content?: JSX.Element;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "sm" | "md" | "lg";
	class?: string;
	/** Corner radius. @default "xl" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

function useHoverCardState(props: HoverCardProps) {
	const merged = mergeProps({ defaultOpen: false }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"variant",
		"size",
		"children",
		"content",
		"open",
		"defaultOpen",
		"onOpenChange",
		"radius",
		"elevation",
	]);
	const [internal, setInternal] = createSignal(merged.defaultOpen);
	const [pos, setPos] = createSignal({ top: 0, left: 0 });
	let triggerRef: HTMLButtonElement | undefined;
	let closeTimer: number | undefined;
	const contentId = `hover-card-${createUniqueId()}`;
	const open = () => (local.open !== undefined ? local.open : internal());
	const setOpen = (value: boolean) => {
		setInternal(value);
		local.onOpenChange?.(value);
	};
	const setTrigger = (el: HTMLButtonElement) => {
		triggerRef = el;
	};
	const updatePosition = () => {
		if (triggerRef) {
			const rect = triggerRef.getBoundingClientRect();
			// Clamp so the card (max 20rem wide) stays inside the viewport.
			const left = Math.max(8, Math.min(rect.left, window.innerWidth - 336));
			setPos({ top: rect.bottom + 8, left });
		}
	};
	const onEnter = () => {
		if (closeTimer) {
			window.clearTimeout(closeTimer);
			closeTimer = undefined;
		}
		updatePosition();
		setOpen(true);
	};
	const onLeave = () => {
		closeTimer = window.setTimeout(() => setOpen(false), 120);
	};
	onCleanup(() => {
		if (closeTimer) window.clearTimeout(closeTimer);
	});
	const className = () => ["relative inline-block", local.class ?? ""].filter(Boolean).join(" ");
	const onContentKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") setOpen(false);
	};
	return { local, rest, open, pos, setOpen, setTrigger, onEnter, onLeave, className, onContentKeyDown, contentId };
}

type HoverCardContext = ReturnType<typeof useHoverCardState>;

function HoverCardContent(props: { context: HoverCardContext }) {
	return (
		<Show when={props.context.open()}>
			<Portal>
				<div
					id={props.context.contentId}
					class={[
						"fixed z-popover min-w-[12rem] max-w-[min(20rem,calc(100vw-2rem))] border motion-safe:animate-[su-fade-in_var(--su-transition-fast)]",
						variantMap[props.context.local.variant ?? "default"],
						paddingSizes[props.context.local.size ?? "md"],
						radiusMap[props.context.local.radius ?? "xl"],
						props.context.local.elevation ? elevationMap[props.context.local.elevation] : "",
					].join(" ")}
					style={{ top: `${props.context.pos().top}px`, left: `${props.context.pos().left}px` }}
					onMouseEnter={props.context.onEnter}
					onMouseLeave={props.context.onLeave}
					onFocus={props.context.onEnter}
					onBlur={props.context.onLeave}
					onKeyDown={props.context.onContentKeyDown}
					role="dialog"
					aria-label="Hover card"
				>
					{props.context.local.content}
				</div>
			</Portal>
		</Show>
	);
}

export function HoverCard(props: HoverCardProps) {
	const context = useHoverCardState(props);

	return (
		<div class={context.className()} {...context.rest}>
			<button
				type="button"
				class="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				ref={context.setTrigger}
				onMouseEnter={context.onEnter}
				onMouseLeave={context.onLeave}
				onFocus={context.onEnter}
				onBlur={context.onLeave}
				aria-haspopup="dialog"
				aria-expanded={context.open()}
				aria-controls={context.open() ? context.contentId : undefined}
			>
				{context.local.children}
			</button>
			<HoverCardContent context={context} />
		</div>
	);
}
