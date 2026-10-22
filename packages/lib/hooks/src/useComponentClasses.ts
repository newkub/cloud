import { splitProps } from "solid-js";

/** Extra prop-driven class axis — e.g. `{ prop: "radius", map: radiusMap, default: "md" }`. */
export interface ClassAxis {
	/** Prop name — must exist on the component's Props interface. */
	prop: string;
	/** prop value → classes. Boolean props index via `map[String(value)]` (e.g. `map.true`). */
	map: Record<string, string>;
	/** Applied when the prop is undefined. Omit to apply nothing by default. */
	default?: string;
}

/** Conditional classes applied when every `when` entry matches the resolved variant/size/axis values. */
export interface CompoundVariant {
	/** Keys are `"variant"`, `"size"` or an axis `prop` — values compared loosely (`String(a) === String(b)`). */
	when: Record<string, string | boolean>;
	/** Classes appended after axes when all conditions match. */
	class: string;
}

export interface ComponentClassesOptions {
	/** Always-applied classes (layout, focus, transitions). */
	base: string;
	/** variant → classes. Applied when props.variant matches. */
	variants?: Record<string, string>;
	/** size → classes (padding/height/text-size). Applied when props.size matches. */
	sizes?: Record<string, string>;
	defaultVariant?: string;
	defaultSize?: string;
	/** Extra axes applied in order after variant and size — radius, elevation, fullWidth, etc. */
	axes?: ClassAxis[];
	/** Variant+size+axis combos applied after axes — e.g. `{ when: { variant: "ghost", size: "sm" }, class: "px-2" }`. */
	compoundVariants?: CompoundVariant[];
	/** Strip all visual classes — output only the user's `class`. */
	unstyled?: boolean;
}

/** Join parts and dedupe whitespace-separated classes, preserving first-seen order. */
const compose = (parts: string[]) =>
	[...new Set(parts.filter(Boolean).join(" ").split(/\s+/).filter(Boolean))].join(" ");

/**
 * Shared class composer — splits `class`, `variant`, `size` (plus any `axes` props)
 * from props and merges base + variant + size + axes + compoundVariants + user
 * class in that order (user class last = wins). Duplicate utilities are dropped.
 *
 * @param props — Component props containing `class`/`variant`/`size` and any `axes` props
 * @param opts — Base classes, variant/size maps, extra axes, compoundVariants, `unstyled`
 * @returns `{ className, rest }` — reactive className accessor + remaining props
 *
 * @example
 * const { className, rest } = useComponentClasses(props, {
 *   base: "rounded-md",
 *   variants: { primary: "bg-primary" },
 *   axes: [{ prop: "radius", map: radiusMap, default: "md" }],
 *   compoundVariants: [{ when: { variant: "primary", size: "sm" }, class: "shadow-none" }],
 * });
 */
export function useComponentClasses<P extends { class?: string; variant?: string; size?: string }>(
	props: P,
	opts: ComponentClassesOptions,
) {
	const axisProps = opts.axes?.map((a) => a.prop) ?? [];
	const [local, rest] = splitProps(props as Record<string, unknown>, [
		"class",
		"variant",
		"size",
		"unstyled",
		...axisProps,
	]);
	const className = () => {
		if (opts.unstyled || local.unstyled) return (local.class as string) || "";
		const variant = (local.variant as string | undefined) ?? opts.defaultVariant;
		const size = (local.size as string | undefined) ?? opts.defaultSize;
		const resolved: Record<string, string | boolean | undefined> = { variant, size };
		const axisClasses =
			opts.axes?.map((axis) => {
				const value = (local[axis.prop] as string | boolean | undefined) ?? axis.default;
				resolved[axis.prop] = value;
				return value === undefined ? "" : (axis.map[String(value)] ?? "");
			}) ?? [];
		const compoundClasses =
			opts.compoundVariants
				?.filter((cv) => Object.entries(cv.when).every(([key, want]) => String(resolved[key] ?? "") === String(want)))
				.map((cv) => cv.class) ?? [];
		return compose([
			opts.base,
			variant ? (opts.variants?.[variant] ?? "") : "",
			size ? (opts.sizes?.[size] ?? "") : "",
			...axisClasses,
			...compoundClasses,
			(local.class as string | undefined) ?? "",
		]);
	};
	return { className, rest: rest as Omit<P, "class" | "variant" | "size"> };
}
