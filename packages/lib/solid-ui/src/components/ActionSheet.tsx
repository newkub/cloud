/**
 * ActionSheet — bottom-anchored list of actions (mobile pattern).
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius } from "../lib/variants";

export interface ActionSheetAction {
	/** Action label */
	label: string;
	/** Optional leading icon */
	icon?: JSX.Element;
	/** Destructive styling @default false */
	destructive?: boolean;
	/** Disabled @default false */
	disabled?: boolean;
	value?: string;
}

export interface ActionSheetProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Visible @default true */
	open?: boolean;
	/** Optional heading */
	title?: string;
	actions: ActionSheetAction[];
	/** Cancel button label — omitted when not set */
	cancelLabel?: string;
	onSelect?: (action: ActionSheetAction) => void;
	onClose?: () => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Sheet width. @default "md" */
	size?: "sm" | "md" | "lg" | "full";
	/** Denser rows. @default false */
	compact?: boolean;
}

const sheetSizes = {
	sm: "max-w-xs",
	md: "max-w-sm",
	lg: "max-w-md",
	full: "max-w-full",
} as const;

const topRadiusMap: Record<Radius, string> = {
	none: "rounded-t-none",
	sm: "rounded-t",
	md: "rounded-t-md",
	lg: "rounded-t-lg",
	xl: "rounded-t-xl",
	"2xl": "rounded-t-2xl",
	"3xl": "rounded-t-3xl",
	full: "rounded-t-full",
};

export function ActionSheet(props: ActionSheetProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"open",
		"title",
		"actions",
		"cancelLabel",
		"onSelect",
		"onClose",
		"radius",
		"elevation",
		"size",
		"compact",
	]);
	return (
		<Show when={local.open ?? true}>
			<div
				role="dialog"
				aria-label={local.title ?? "Actions"}
				tabIndex={-1}
				class={`solidui-action-sheet w-full overflow-hidden border border-border bg-surface pb-[env(safe-area-inset-bottom)] ${sheetSizes[local.size ?? "md"]} ${topRadiusMap[local.radius ?? "2xl"]} ${elevationMap[local.elevation ?? "lg"]} ${local.class ?? ""}`.trim()}
				onKeyDown={(e) => {
					if (e.key === "Escape") local.onClose?.();
				}}
				{...rest}
			>
				<Show when={local.title}>
					<div class="border-b border-border px-4 py-3 text-center text-xs font-medium text-muted-foreground">
						{local.title}
					</div>
				</Show>
				<div class="divide-y divide-border">
					<For each={local.actions}>
						{(action) => (
							<button
								type="button"
								disabled={action.disabled}
								class={`flex w-full items-center justify-center gap-2 ${local.compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"} transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${
									action.destructive ? "text-destructive" : "text-foreground"
								}`}
								onClick={() => {
									local.onSelect?.(action);
									local.onClose?.();
								}}
							>
								{action.icon}
								{action.label}
							</button>
						)}
					</For>
				</div>
				<Show when={local.cancelLabel}>
					<button
						type="button"
						class="w-full border-t-4 border-muted px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						onClick={() => local.onClose?.()}
					>
						{local.cancelLabel}
					</button>
				</Show>
			</div>
		</Show>
	);
}
