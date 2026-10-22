import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export type Direction = "ltr" | "rtl";

export interface DirectionControls {
	/** Current text direction — "ltr" | "rtl" */
	dir: Accessor<Direction>;
	/** True when the document/component is right-to-left */
	isRtl: Accessor<boolean>;
	/** Set direction on the signal (and <html dir> when bound) */
	set: (d: Direction) => void;
	/** Bind `dir` to <html> and keep the signal in sync with attribute changes */
	applyToDocument: () => void;
}

/**
 * Text direction (LTR/RTL) as a signal. `applyToDocument()` syncs
 * `<html dir>` both ways — sets the attribute on `set()` and observes
 * external changes via MutationObserver.
 *
 * @example
 * const { dir, isRtl, set, applyToDocument } = useDirection();
 * applyToDocument();
 * <div dir={dir()}>{isRtl() ? "مرحبا" : "Hello"}</div>
 */
export function useDirection(initial: Direction = "ltr"): DirectionControls {
	const [dir, setDir] = createSignal<Direction>(initial);
	const isRtl = () => dir() === "rtl";

	const applyToDocument = () => {
		onMount(() => {
			const el = document.documentElement;
			const existing = el.getAttribute("dir");
			if (existing === "ltr" || existing === "rtl") setDir(existing);
			else el.setAttribute("dir", dir());
			const obs = new MutationObserver(() => {
				const d = el.getAttribute("dir");
				if (d === "ltr" || d === "rtl") setDir(d);
			});
			obs.observe(el, { attributes: true, attributeFilter: ["dir"] });
			onCleanup(() => obs.disconnect());
		});
	};

	return {
		dir,
		isRtl,
		set: (d) => {
			setDir(d);
			if (typeof document !== "undefined") document.documentElement.setAttribute("dir", d);
		},
		applyToDocument,
	};
}
