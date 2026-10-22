/**
 * Callout - highlighted aside for notes, warnings or tips, optionally dismissible.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface CalloutProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: "info" | "success" | "warning" | "danger";
	title?: string;
	dismissible?: boolean;
	onDismiss?: () => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const variantClasses: Record<NonNullable<CalloutProps["variant"]>, string> = {
	info: "border-info bg-info/10 text-foreground",
	success: "border-success bg-success/10 text-foreground",
	warning: "border-warning bg-warning/10 text-foreground",
	danger: "border-destructive bg-destructive/10 text-foreground",
};

export function Callout(props: CalloutProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"variant",
		"title",
		"dismissible",
		"onDismiss",
		"radius",
		"elevation",
	]);
	const [dismissed, setDismissed] = createSignal(false);

	const dismiss = () => {
		setDismissed(true);
		local.onDismiss?.();
	};

	const className = () =>
		[
			" border-l-4 p-4 text-sm",
			variantClasses[local.variant ?? "info"],
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<Show when={!dismissed()}>
			<div class={className()} role="note" {...rest}>
				<div class="flex items-start justify-between gap-2">
					<div class="flex-1">
						<Show when={local.title}>
							<div class="mb-1 font-semibold">{local.title}</div>
						</Show>
						<div>{local.children}</div>
					</div>
					<Show when={local.dismissible}>
						<button
							type="button"
							class="-m-1.5 flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							aria-label="Dismiss"
							onClick={dismiss}
						>
							✕
						</button>
					</Show>
				</div>
			</div>
		</Show>
	);
}
