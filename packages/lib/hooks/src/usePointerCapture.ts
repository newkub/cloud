import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface PointerCaptureControls {
	/** True while this hook holds a pointer capture */
	captured: Accessor<boolean>;
	/** Pointer id currently captured, `null` when none */
	pointerId: Accessor<number | null>;
	/** Element holding the capture, `null` when none */
	element: Accessor<Element | null>;
	/**
	 * Capture `pointerId` on `el` via `setPointerCapture` — returns false when
	 * the API is missing or the call throws (e.g. an inactive pointer id)
	 */
	capture: (el: Element, pointerId: number) => boolean;
	/** Release the active capture via `releasePointerCapture` — no-op when none */
	release: () => void;
	/** Whether the Pointer Capture API exists on `Element.prototype` */
	supported: boolean;
}

/**
 * Pointer capture as signals — `capture(el, id)` calls `setPointerCapture` so
 * all pointer events for that pointer retarget to `el` (useful for drags that
 * must keep tracking after the cursor leaves the element). `captured()` flips
 * false on `lostpointercapture`/`pointerup` or an explicit `release()`.
 *
 * @returns `{ captured, pointerId, element, capture, release, supported }`
 *
 * @example
 * const cap = usePointerCapture();
 * <div onPointerDown={(e) => cap.capture(e.currentTarget, e.pointerId)} />
 */
export function usePointerCapture(): PointerCaptureControls {
	const [captured, setCaptured] = createSignal(false);
	const [pointerId, setPointerId] = createSignal<number | null>(null);
	const [element, setElement] = createSignal<Element | null>(null);
	const supported =
		typeof Element !== "undefined" &&
		"setPointerCapture" in Element.prototype &&
		"releasePointerCapture" in Element.prototype;

	const release = () => {
		const el = element();
		const id = pointerId();
		if (el) {
			el.removeEventListener("lostpointercapture", onLost);
			el.removeEventListener("pointerup", onLost);
			if (id !== null && typeof el.releasePointerCapture === "function") {
				try {
					el.releasePointerCapture(id);
				} catch {
					// already released or pointer no longer active
				}
			}
		}
		setElement(null);
		setPointerId(null);
		setCaptured(false);
	};

	function onLost() {
		release();
	}

	const capture = (el: Element, id: number): boolean => {
		if (typeof el.setPointerCapture !== "function") return false;
		release();
		try {
			el.setPointerCapture(id);
		} catch {
			return false;
		}
		setElement(el);
		setPointerId(id);
		setCaptured(typeof el.hasPointerCapture === "function" ? el.hasPointerCapture(id) : true);
		el.addEventListener("lostpointercapture", onLost);
		el.addEventListener("pointerup", onLost);
		return captured();
	};

	onCleanup(release);

	return { captured, pointerId, element, capture, release, supported };
}
