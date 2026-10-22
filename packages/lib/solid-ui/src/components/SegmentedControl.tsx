/**
 * SegmentedControl - segmented single-choice toggle.
 */
import { type Accessor, createContext, createSignal, type JSX, mergeProps, splitProps, useContext } from "solid-js";
import { controlSizes, controlVariants, type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

interface SegmentedControlContextValue {
	value: Accessor<string>;
	setValue: (value: string) => void;
}

const SegmentedControlContext = createContext<SegmentedControlContextValue>();

export interface SegmentedControlProps extends JSX.HTMLAttributes<HTMLDivElement> {
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

export function SegmentedControl(props: SegmentedControlProps) {
	const merged = mergeProps({ defaultValue: "" }, props);
	const [internal, setInternal] = createSignal(merged.defaultValue);
	const value = () => (props.value !== undefined ? props.value : internal());
	const setValue = (next: string) => {
		setInternal(next);
		props.onValueChange?.(next);
	};

	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"onValueChange",
		"children",
		"onKeyDown",
		"variant",
		"size",
		"radius",
		"elevation",
		"fullWidth",
	]);
	const className = () =>
		[
			"inline-flex border border-border bg-muted p-1",
			local.variant ? controlVariants[local.variant] : "",
			local.size ? controlSizes[local.size] : "",
			radiusMap[local.radius ?? "lg"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.fullWidth ? "w-full" : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onKeyDown = (e: KeyboardEvent) => {
		if (typeof local.onKeyDown === "function") {
			(local.onKeyDown as (e: KeyboardEvent) => void)(e);
		}
		if (e.defaultPrevented) return;
		if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
		const items = Array.from((e.currentTarget as HTMLDivElement).querySelectorAll<HTMLButtonElement>('[role="radio"]'));
		if (items.length === 0) return;
		e.preventDefault();
		const dir = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
		const current = items.findIndex((item) => item.getAttribute("data-value") === value());
		const next = items[(current + dir + items.length) % items.length];
		const nextValue = next?.getAttribute("data-value");
		if (nextValue !== null && nextValue !== undefined) {
			setValue(nextValue);
			next.focus();
		}
	};

	return (
		<SegmentedControlContext.Provider value={{ value, setValue }}>
			<div class={className()} role="radiogroup" onKeyDown={onKeyDown} {...rest}>
				{local.children}
			</div>
		</SegmentedControlContext.Provider>
	);
}

export interface SegmentedControlItemProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

export function SegmentedControlItem(props: SegmentedControlItemProps) {
	const context = useContext(SegmentedControlContext);
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"children",
		"onClick",
		"radius",
		"elevation",
		"fullWidth",
	]);

	if (!context) {
		throw new Error("SegmentedControlItem must be used inside a SegmentedControl.");
	}

	const active = () => context.value() === local.value;
	const className = () =>
		[
			"inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
			active()
				? "bg-background text-foreground shadow-sm"
				: "text-muted-foreground hover:bg-muted hover:text-foreground",
			radiusMap[local.radius ?? "md"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.fullWidth ? "w-full" : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const onClick = (e: MouseEvent) => {
		context.setValue(local.value);
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};

	return (
		// biome-ignore lint/a11y/useSemanticElements: segmented items are button-styled radios; a hidden native radio would lose the toggle look
		<button
			type="button"
			role="radio"
			aria-checked={active()}
			data-value={local.value}
			tabIndex={active() ? 0 : -1}
			class={className()}
			onClick={onClick}
			{...rest}
		>
			{local.children}
		</button>
	);
}
