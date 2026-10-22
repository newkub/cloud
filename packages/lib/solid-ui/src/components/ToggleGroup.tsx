/**
 * ToggleGroup - group of exclusive or multiple toggle buttons.
 */
import { type Accessor, createContext, createSignal, type JSX, mergeProps, splitProps, useContext } from "solid-js";
import { controlSizes, controlVariants, type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export type ToggleGroupType = "single" | "multiple";

interface ToggleGroupSingleProps extends JSX.HTMLAttributes<HTMLDivElement> {
	type?: "single";
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	variant?: keyof typeof controlVariants;
	size?: keyof typeof controlSizes;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

interface ToggleGroupMultipleProps extends JSX.HTMLAttributes<HTMLDivElement> {
	type: "multiple";
	value?: string[];
	defaultValue?: string[];
	onValueChange?: (value: string[]) => void;
	variant?: keyof typeof controlVariants;
	size?: keyof typeof controlSizes;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

interface ToggleGroupContextValue {
	value: Accessor<string | string[]>;
	isPressed: (value: string) => boolean;
	onToggle: (value: string) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>();

export interface ToggleGroupItemProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

export function ToggleGroup(props: ToggleGroupProps) {
	const defaultValue = () => (props.type === "multiple" ? ([] as string[]) : "");
	const merged = mergeProps({ defaultValue: defaultValue() }, props);
	const [local, rest] = splitProps(props as Record<string, unknown>, [
		"type",
		"value",
		"defaultValue",
		"onValueChange",
		"class",
		"children",
		"variant",
		"size",
		"radius",
		"elevation",
		"fullWidth",
	]);
	const [internal, setInternal] = createSignal<string | string[]>(merged.defaultValue as string | string[]);

	const value = () => (local.value !== undefined ? (local.value as string | string[]) : internal());
	const isSingle = () => local.type !== "multiple";
	const isPressed = (val: string) => {
		if (isSingle()) return value() === val;
		return (value() as string[]).includes(val);
	};
	const onToggle = (val: string) => {
		if (isSingle()) {
			const current = value() as string;
			const next = current === val ? "" : val;
			if (local.value === undefined) setInternal(next);
			(props as ToggleGroupSingleProps).onValueChange?.(next);
		} else {
			const current = value() as string[];
			const next = current.includes(val) ? current.filter((i) => i !== val) : [...current, val];
			if (local.value === undefined) setInternal(next);
			(props as ToggleGroupMultipleProps).onValueChange?.(next);
		}
	};

	const className = () =>
		[
			"inline-flex gap-1 border border-border bg-surface p-1",
			local.variant ? controlVariants[local.variant as keyof typeof controlVariants] : "",
			local.size ? controlSizes[local.size as keyof typeof controlSizes] : "",
			radiusMap[(local.radius as Radius) ?? "lg"],
			local.elevation ? elevationMap[local.elevation as Elevation] : "",
			local.fullWidth ? "w-full" : "",
			(local.class as string) ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<ToggleGroupContext.Provider value={{ value, isPressed, onToggle }}>
			{/* biome-ignore lint/a11y/useSemanticElements: generic button group, not a form fieldset */}
			<div class={className()} role="group" {...(rest as JSX.HTMLAttributes<HTMLDivElement>)}>
				{(local.children as JSX.Element) ?? undefined}
			</div>
		</ToggleGroupContext.Provider>
	);
}

export function ToggleGroupItem(props: ToggleGroupItemProps) {
	const ctx = useContext(ToggleGroupContext);
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"children",
		"onClick",
		"radius",
		"elevation",
		"fullWidth",
	]);

	if (!ctx) {
		throw new Error("ToggleGroupItem must be used inside a ToggleGroup.");
	}

	const pressed = () => ctx.isPressed(local.value);
	const className = () => {
		const base =
			"inline-flex items-center justify-center px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
		return [
			base,
			pressed()
				? "bg-primary text-primary-foreground hover:bg-primary/90"
				: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.fullWidth ? "w-full" : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	};

	const onClick = (e: MouseEvent) => {
		ctx.onToggle(local.value);
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};

	return (
		<button type="button" aria-pressed={pressed()} class={className()} onClick={onClick} {...rest}>
			{local.children}
		</button>
	);
}
