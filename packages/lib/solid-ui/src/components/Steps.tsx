/**
 * Steps - numbered step flow with current-step highlighting.
 */
import { type Accessor, createContext, type JSX, mergeProps, Show, splitProps, useContext } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = { ...surfaceVariants, default: "" };

export type StepState = "completed" | "current" | "pending";

export interface StepsProps extends JSX.HTMLAttributes<HTMLOListElement> {
	current?: number;
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

interface StepsContextValue {
	current: Accessor<number>;
}

const StepsContext = createContext<StepsContextValue>({ current: () => 0 });

export interface StepBaseProps extends Omit<JSX.HTMLAttributes<HTMLLIElement>, "title"> {
	index?: number;
	title?: JSX.Element;
	description?: JSX.Element;
	state?: StepState;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export interface StepProps extends StepBaseProps {}

export interface StepItemProps extends StepBaseProps {}

export function Steps(props: StepsProps) {
	const merged = mergeProps({ current: 0 }, props);
	const [local, rest] = splitProps(props, ["class", "current", "variant", "size", "children", "radius", "elevation"]);
	const current = () => merged.current;
	const className = () =>
		[
			"flex w-full flex-wrap items-start gap-4",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "none"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<StepsContext.Provider value={{ current }}>
			<ol class={className()} {...rest}>
				{local.children}
			</ol>
		</StepsContext.Provider>
	);
}

function stepState(ctx: StepsContextValue, index: number | undefined, override: StepState | undefined): StepState {
	if (override) return override;
	const idx = index ?? 0;
	if (ctx.current() > idx) return "completed";
	if (ctx.current() === idx) return "current";
	return "pending";
}

function circleClasses(state: StepState) {
	switch (state) {
		case "completed":
			return "border-primary bg-primary text-primary-foreground";
		case "current":
			return "border-primary bg-background text-primary";
		case "pending":
			return "border-muted bg-background text-muted-foreground";
	}
}

function StepContent(props: StepProps) {
	const ctx = useContext(StepsContext);
	const [local, rest] = splitProps(props, [
		"class",
		"index",
		"title",
		"description",
		"state",
		"children",
		"radius",
		"elevation",
	]);
	const state = () => stepState(ctx, local.index, local.state);
	const className = () =>
		[
			"flex flex-1 flex-col items-center gap-2 text-center",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const circleClass = () =>
		[
			"flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
			circleClasses(state()),
		]
			.filter(Boolean)
			.join(" ");

	return (
		<li class={className()} aria-current={state() === "current" ? "step" : undefined} {...rest}>
			<span class={circleClass()}>{(local.index ?? 0) + 1}</span>
			<Show when={local.title}>
				<span class="text-sm font-medium text-foreground">{local.title}</span>
			</Show>
			<Show when={local.description}>
				<span class="text-xs text-muted-foreground">{local.description}</span>
			</Show>
			{local.children}
		</li>
	);
}

export function Step(props: StepProps) {
	return <StepContent {...props} />;
}

export function StepItem(props: StepItemProps) {
	return <StepContent {...props} />;
}
