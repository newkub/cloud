/**
 * FloatButton — floating action button anchored to a corner; pass `actions` to
 * fan out labelled secondary actions (speed-dial pattern).
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { controlVariants, type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface FloatButtonAction {
	/** Action id. */
	id: string;
	/** Tooltip / aria label. */
	label: string;
	/** Icon name or custom JSX. */
	icon?: JSX.Element | string;
	/** Called when the action is picked. */
	onSelect?: () => void;
}

export interface FloatButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Corner placement @default "bottom-right" */
	position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
	/** Use fixed positioning (otherwise inline) @default true */
	fixed?: boolean;
	variant?: keyof typeof controlVariants;
	/** Button size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Accessible label when children are icon-only */
	label?: string;
	/** Secondary actions fanned out above the FAB (speed-dial mode). */
	actions?: FloatButtonAction[];
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

const posClass = {
	"bottom-right": "bottom-4 right-4",
	"bottom-left": "bottom-4 left-4",
	"top-right": "top-4 right-4",
	"top-left": "top-4 left-4",
} as const;
const sizeClass = { sm: "h-9 w-9 text-sm", md: "h-12 w-12 text-lg", lg: "h-14 w-14 text-xl" } as const;

const renderIcon = (icon: JSX.Element | string | undefined, fallback: JSX.Element) =>
	typeof icon === "string" ? <NamedIcon name={icon} class="h-4 w-4" /> : (icon ?? fallback);

export function FloatButton(props: FloatButtonProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"position",
		"fixed",
		"variant",
		"size",
		"label",
		"actions",
		"radius",
		"elevation",
		"fullWidth",
	]);
	const [open, setOpen] = createSignal(false);

	const btnClass = () =>
		`solidui-float-btn ${local.actions ? "" : (local.fixed ?? true) ? "fixed" : ""} ${local.actions ? "" : posClass[local.position ?? "bottom-right"]} z-fixed inline-flex items-center justify-center transition-transform motion-reduce:transition-none motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${controlVariants[local.variant ?? "primary"]} ${sizeClass[local.size ?? "md"]} ${radiusMap[local.radius ?? "full"]} ${elevationMap[local.elevation ?? "lg"]} ${local.fullWidth ? "w-full" : ""} ${local.class ?? ""}`.trim();

	if (local.actions) {
		return (
			<div
				class={`solidui-float-btn ${(local.fixed ?? true) ? "fixed" : "relative"} ${posClass[local.position ?? "bottom-right"]} z-fixed flex flex-col items-end gap-2`}
			>
				<Show when={open()}>
					<div class="flex flex-col items-end gap-2 motion-safe:animate-[su-slide-up_var(--su-transition-fast)]">
						<For each={local.actions}>
							{(a) => (
								<button
									type="button"
									class="inline-flex items-center gap-2 rounded-full border border-border bg-popover py-1.5 pl-3 pr-2 text-sm shadow-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
									onClick={() => {
										a.onSelect?.();
										setOpen(false);
									}}
								>
									<span>{a.label}</span>
									<span class="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
										{renderIcon(a.icon, <NamedIcon name="zap" class="h-4 w-4" />)}
									</span>
								</button>
							)}
						</For>
					</div>
				</Show>
				<button
					type="button"
					class={btnClass()}
					aria-label={local.label ?? "Actions"}
					aria-expanded={open()}
					onClick={() => setOpen((v) => !v)}
					{...rest}
				>
					{local.children ?? <NamedIcon name="plus" class="h-5 w-5" />}
				</button>
			</div>
		);
	}

	return (
		<button type="button" aria-label={local.label} class={btnClass()} {...rest}>
			{local.children ?? "+"}
		</button>
	);
}
