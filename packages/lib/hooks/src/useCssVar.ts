import { type Accessor, createEffect, createSignal } from "solid-js";

export interface CssVarControls {
	/** Current value — reads the computed style first, then tracks `set` */
	get: Accessor<string>;
	/** Write the custom property (inline `style.setProperty`) */
	set: (v: string) => void;
}

/**
 * Read/write a CSS custom property. Defaults to `:root`
 * (`document.documentElement`); pass a ref accessor to scope it to an element.
 * Re-reads the computed value when the target changes.
 *
 * @param name — Custom property name, e.g. `"--accent"`
 * @param target — Optional accessor for the element holding the variable
 * @returns `{ get, set }` controls
 *
 * @example
 * const accent = useCssVar("--accent");
 * accent.set("#e11d48"); <p>{accent.get()}</p>
 */
export function useCssVar(name: string, target?: Accessor<HTMLElement | undefined>): CssVarControls {
	const [value, setValue] = createSignal("");

	createEffect(() => {
		const el = target?.() ?? (typeof document !== "undefined" ? document.documentElement : undefined);
		if (!el || typeof getComputedStyle === "undefined") return;
		setValue((el.style.getPropertyValue(name) || getComputedStyle(el).getPropertyValue(name)).trim());
	});

	return {
		get: value,
		set: (v) => {
			const el = target?.() ?? (typeof document !== "undefined" ? document.documentElement : undefined);
			el?.style.setProperty(name, v);
			setValue(v);
		},
	};
}
