import { splitProps } from "solid-js";

export interface ClassNameOptions {
	/** `size` prop value → classes lookup. */
	sizes?: Record<string, string>;
	/** Applied when `variant` is undefined. */
	defaultVariant?: string;
	/** Applied when `size` is undefined. */
	defaultSize?: string;
	/** Strip all visual classes — output only the user's `class`. Also honors a `unstyled` prop. */
	unstyled?: boolean;
}

/** Join parts and dedupe whitespace-separated classes, preserving first-seen order. */
const compose = (parts: string[]) =>
	[...new Set(parts.filter(Boolean).join(" ").split(/\s+/).filter(Boolean))].join(" ");

/**
 * Minimal class composer — joins `base` + variant map entry (+ optional size
 * map entry) + user `class`, splitting `class`/`variant`/`size`/`unstyled`
 * out of `rest`. Duplicate utilities are dropped.
 *
 * @param props — Component props containing `class` and/or `variant` (and optionally `size`/`unstyled`)
 * @param base — Always-applied classes
 * @param variantMap — Optional `variant` value → classes lookup
 * @param options — Optional `sizes` map, defaults, and `unstyled` switch
 * @returns `{ className, rest }` — reactive className accessor + remaining props
 *
 * @example
 * const { className, rest } = useClassName(props, "badge", { solid: "bg-primary" }, { sizes: sizeMap });
 * <span class={className()} {...rest} />
 */
export function useClassName<P extends { class?: string; variant?: string; size?: string }>(
	props: P,
	base: string,
	variantMap?: Record<string, string>,
	options?: ClassNameOptions,
) {
	const [local, rest] = splitProps(props as Record<string, unknown>, ["class", "variant", "size", "unstyled"]);
	const className = () => {
		if (options?.unstyled || local.unstyled) return (local.class as string) || "";
		const parts: string[] = [base];
		const variant = (local.variant as string | undefined) ?? options?.defaultVariant;
		if (variantMap && variant) {
			const variantClass = variantMap[variant];
			if (variantClass) parts.push(variantClass);
		}
		const size = (local.size as string | undefined) ?? options?.defaultSize;
		if (options?.sizes && size) {
			const sizeClass = options.sizes[size];
			if (sizeClass) parts.push(sizeClass);
		}
		const localClass = local.class as string | undefined;
		if (localClass) parts.push(localClass);
		return compose(parts);
	};
	return { className, rest: rest as Omit<P, "class" | "variant"> };
}
