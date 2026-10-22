/**
 * Collapsible panel with trigger and content
 */
import { createContext, createSignal, type JSX, Show, splitProps, useContext } from "solid-js";
import { type Elevation, elevationMap, paddingSizes, type Radius, radiusMap, surfaceVariants } from "../lib/variants";

interface CollapsibleContextValue {
	open: () => boolean;
	toggle: () => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue>();

export interface CollapsibleProps extends JSX.HTMLAttributes<HTMLDivElement> {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Collapsible(props: CollapsibleProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"open",
		"defaultOpen",
		"onOpenChange",
		"variant",
		"size",
		"children",
		"radius",
		"elevation",
	]);
	const [internal, setInternal] = createSignal(local.defaultOpen ?? false);

	const open = () => (local.open !== undefined ? local.open : internal());
	const toggle = () => {
		const next = !open();
		setInternal(next);
		local.onOpenChange?.(next);
	};

	const className = () =>
		[
			"w-full",
			local.variant ? surfaceVariants[local.variant] : "",
			local.size ? paddingSizes[local.size] : "",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<CollapsibleContext.Provider value={{ open, toggle }}>
			<div class={className()} {...rest}>
				{local.children}
			</div>
		</CollapsibleContext.Provider>
	);
}

export interface CollapsibleTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
	const ctx = useContext(CollapsibleContext);
	const [local, rest] = splitProps(props, ["class", "children", "onClick", "radius", "elevation"]);

	if (!ctx) {
		throw new Error("Collapsible.Trigger must be used inside a Collapsible.");
	}

	const className = () =>
		[
			"inline-flex min-h-9 w-full items-center justify-between text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onClick = (e: MouseEvent) => {
		ctx.toggle();
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};

	return (
		<button type="button" class={className()} onClick={onClick} aria-expanded={ctx.open()} {...rest}>
			{local.children}
			<svg
				class={`h-4 w-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${ctx.open() ? "rotate-180" : ""}`}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="m6 9 6 6 6-6" />
			</svg>
		</button>
	);
}

export interface CollapsibleContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function CollapsibleContent(props: CollapsibleContentProps) {
	const ctx = useContext(CollapsibleContext);
	const [local, rest] = splitProps(props, ["class", "children", "radius", "elevation"]);

	if (!ctx) {
		throw new Error("Collapsible.Content must be used inside a Collapsible.");
	}

	const className = () =>
		[
			"overflow-hidden text-sm text-muted-foreground",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<Show when={ctx.open()}>
			<div class={className()} {...rest}>
				{local.children}
			</div>
		</Show>
	);
}
