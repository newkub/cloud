/**
 * Banner - top announcement strip with optional dismiss.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, paddingSizes, type Radius, radiusMap } from "../lib/variants";

export interface BannerProps extends JSX.HTMLAttributes<HTMLElement> {
	variant?: "default" | "primary" | "info" | "success" | "warning" | "destructive" | "danger";
	size?: "sm" | "md" | "lg";
	dismissible?: boolean;
	onDismiss?: () => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const variantClasses: Record<NonNullable<BannerProps["variant"]>, string> = {
	default: "bg-background text-foreground",
	primary: "bg-primary/10 text-foreground",
	info: "bg-info/10 text-foreground",
	success: "bg-success/10 text-foreground",
	warning: "bg-warning/10 text-foreground",
	destructive: "bg-destructive/10 text-foreground",
	danger: "bg-destructive/10 text-foreground",
};

export function Banner(props: BannerProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"variant",
		"size",
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
			"w-full border-b border-border text-sm",
			variantClasses[local.variant ?? "default"],
			paddingSizes[local.size ?? "md"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<Show when={!dismissed()}>
			<header class={className()} {...rest}>
				<div class="mx-auto flex max-w-5xl items-center justify-between gap-3">
					<div class="flex-1">{local.children}</div>
					<Show when={local.dismissible}>
						<button
							type="button"
							class="-my-1.5 flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							aria-label="Dismiss banner"
							onClick={dismiss}
						>
							✕
						</button>
					</Show>
				</div>
			</header>
		</Show>
	);
}
