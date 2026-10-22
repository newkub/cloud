/**
 * InlineActions — inline edit/save/cancel action row for read-write fields.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

/** A declarative action button — icon and/or label. */
export interface InlineAction {
	/** Unique key used for rendering and identification. */
	key: string;
	/** Accessible label / visible text. */
	label: string;
	/** Optional leading icon. */
	icon?: JSX.Element;
	onClick?: () => void;
	disabled?: boolean;
	/** Use the primary (filled) style. @default false */
	primary?: boolean;
	/** Compact icon-only rendering (label becomes aria-label/title). @default false */
	iconOnly?: boolean;
}

export interface InlineActionsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Whether the row is in edit mode. */
	editing?: boolean;
	onEdit?: () => void;
	onSave?: () => void;
	onCancel?: () => void;
	/** Disable save (invalid state). */
	saveDisabled?: boolean;
	/** Extra slot rendered before the default buttons. */
	actions?: JSX.Element;
	/** Declarative action buttons rendered before the default edit/save/cancel buttons. */
	items?: InlineAction[];
	labels?: { edit?: string; save?: string; cancel?: string };
	/** Fade in on parent hover/focus — add `group` to the parent element. @default false */
	showOnHover?: boolean;
	size?: "sm" | "md" | "lg";
}

const btnSize = { sm: "h-6 text-2xs px-2", md: "h-7 text-xs px-2.5", lg: "h-8 text-sm px-3" } as const;
const iconBtnSize = { sm: "h-6 w-6", md: "h-7 w-7", lg: "h-8 w-8" } as const;

export function InlineActions(props: InlineActionsProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"editing",
		"onEdit",
		"onSave",
		"onCancel",
		"saveDisabled",
		"actions",
		"items",
		"labels",
		"showOnHover",
		"size",
	]);
	const l = () => ({ edit: "Edit", save: "Save", cancel: "Cancel", ...local.labels });
	const btn = (label: string, fn: (() => void) | undefined, primary: boolean, disabled?: boolean) => (
		<button
			type="button"
			disabled={disabled}
			class={`rounded-md font-medium motion-safe:transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${btnSize[local.size ?? "md"]} ${
				primary
					? "bg-primary text-primary-foreground hover:bg-primary/90"
					: "border border-border bg-transparent text-foreground hover:bg-muted"
			}`}
			onClick={fn}
		>
			{label}
		</button>
	);
	return (
		<div
			class={`solidui-inline-actions inline-flex items-center gap-1.5 ${
				local.showOnHover
					? "opacity-0 motion-safe:transition-opacity motion-reduce:opacity-100 group-hover:opacity-100 focus-within:opacity-100"
					: ""
			} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.actions}
			<For each={local.items}>
				{(item) => (
					<button
						type="button"
						disabled={item.disabled}
						aria-label={item.iconOnly ? item.label : undefined}
						title={item.iconOnly ? item.label : undefined}
						class={`inline-flex items-center justify-center gap-1 rounded-md font-medium motion-safe:transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${
							item.iconOnly ? iconBtnSize[local.size ?? "md"] : btnSize[local.size ?? "md"]
						} ${
							item.primary
								? "bg-primary text-primary-foreground hover:bg-primary/90"
								: "border border-border bg-transparent text-foreground hover:bg-muted"
						}`}
						onClick={item.onClick}
					>
						{item.icon}
						<Show when={!item.iconOnly}>{item.label}</Show>
					</button>
				)}
			</For>
			<Show when={local.editing} fallback={local.onEdit && btn(l().edit, local.onEdit, false)}>
				{local.onSave && btn(l().save, local.onSave, true, local.saveDisabled)}
				{local.onCancel && btn(l().cancel, local.onCancel, false)}
			</Show>
		</div>
	);
}
