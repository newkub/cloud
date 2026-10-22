/**
 * Coachmark — anchored tip bubble with arrow, title, body, and dismiss.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CoachmarkProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Tip heading */
	title?: string;
	/** Arrow side @default "top" */
	side?: "top" | "bottom" | "left" | "right";
	/** Accent tone @default "primary" */
	variant?: "primary" | "info" | "success" | "warning";
	/** Allow dismiss via the ✕ button @default true */
	dismissible?: boolean;
	onDismiss?: () => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const arrowPos: Record<NonNullable<CoachmarkProps["side"]>, string> = {
	top: "-top-1.5 left-1/2 -translate-x-1/2",
	bottom: "-bottom-1.5 left-1/2 -translate-x-1/2",
	left: "-left-1.5 top-1/2 -translate-y-1/2",
	right: "-right-1.5 top-1/2 -translate-y-1/2",
};
const variantClass = {
	primary: "border-primary/30 bg-surface",
	info: "border-info/30 bg-surface",
	success: "border-success/30 bg-surface",
	warning: "border-warning/30 bg-surface",
} as const;

export function Coachmark(props: CoachmarkProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"title",
		"side",
		"variant",
		"dismissible",
		"onDismiss",
		"radius",
		"elevation",
	]);
	const [dismissed, setDismissed] = createSignal(false);
	return (
		<Show when={!dismissed()}>
			<div
				role="note"
				class={`solidui-coachmark relative max-w-xs border p-3 ${variantClass[local.variant ?? "primary"]} ${radiusMap[local.radius ?? "lg"]} ${elevationMap[local.elevation ?? "lg"]} ${local.class ?? ""}`.trim()}
				{...rest}
			>
				<span
					class={`absolute h-3 w-3 rotate-45 border-l border-t border-inherit bg-inherit ${arrowPos[local.side ?? "top"]}`}
				/>
				<div class="flex items-start justify-between gap-2">
					<div class="min-w-0">
						<Show when={local.title}>
							<p class="text-sm font-semibold text-foreground">{local.title}</p>
						</Show>
						<div class="text-xs text-muted-foreground">{local.children}</div>
					</div>
					<Show when={local.dismissible ?? true}>
						<button
							type="button"
							aria-label="Dismiss tip"
							class="-mr-1.5 -mt-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							onClick={() => {
								setDismissed(true);
								local.onDismiss?.();
							}}
						>
							✕
						</button>
					</Show>
				</div>
			</div>
		</Show>
	);
}
