/**
 * ToolbarRow — horizontal icon-button toolbar with divider-separated groups, toggle state and tooltips.
 */
import { For, type JSX, splitProps } from "solid-js";

export interface ToolbarItem {
	/** Icon (JSX or glyph) rendered inside the button. */
	icon: JSX.Element;
	/** Accessible name — also used as the tooltip via `title`. */
	label: string;
	/** Toggle state — renders `aria-pressed` when defined. */
	pressed?: boolean;
	/** Click handler. */
	onPress?: () => void;
	/** Disable the button. @default false */
	disabled?: boolean;
}

export interface ToolbarGroup {
	/** Buttons in this group — a divider is rendered between groups. */
	items: ToolbarItem[];
}

export interface ToolbarRowProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Groups of toolbar buttons. */
	groups: ToolbarGroup[];
	/** Toolbar accessible name. @default "Toolbar" */
	"aria-label"?: string;
}

export function ToolbarRow(props: ToolbarRowProps) {
	const [local, rest] = splitProps(props, ["class", "groups", "aria-label"]);

	const btnCls = (pressed: boolean) =>
		`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
			pressed ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
		}`;

	return (
		<div
			role="toolbar"
			aria-label={local["aria-label"] ?? "Toolbar"}
			class={`solidui-toolbar-row inline-flex items-center gap-1 rounded-md border border-border bg-background p-1 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.groups ?? []}>
				{(group, gi) => (
					<>
						{gi() > 0 ? <hr aria-orientation="vertical" class="mx-1 h-5 w-px shrink-0 border-0 bg-border" /> : null}
						<For each={group.items}>
							{(item) => (
								<button
									type="button"
									class={btnCls(item.pressed ?? false)}
									aria-label={item.label}
									aria-pressed={item.pressed === undefined ? undefined : item.pressed}
									title={item.label}
									disabled={item.disabled}
									onClick={() => item.onPress?.()}
								>
									<span class="inline-flex h-4 w-4 items-center justify-center" aria-hidden="true">
										{item.icon}
									</span>
								</button>
							)}
						</For>
					</>
				)}
			</For>
		</div>
	);
}
