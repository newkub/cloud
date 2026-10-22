import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface BeforeUnloadControls {
	/** True while the beforeunload confirm is armed — `when()` unless overridden by `enable`/`disable` */
	active: Accessor<boolean>;
	/** Force the confirm on regardless of `when()` */
	enable: () => void;
	/** Force the confirm off regardless of `when()` */
	disable: () => void;
}

/**
 * Attach a `beforeunload` confirm dialog while `when()` is true — the browser
 * shows its native "leave site?" prompt. `enable()`/`disable()` override the
 * accessor until the opposite one is called.
 *
 * @param when — Accessor that decides whether leaving needs confirmation
 * @returns `{ active, enable, disable }`
 *
 * @example
 * const [dirty] = createSignal(form.isDirty);
 * const guard = useBeforeUnload(dirty);
 * <button onClick={guard.disable}>save & allow leaving</button>
 */
export function useBeforeUnload(when: Accessor<boolean>): BeforeUnloadControls {
	const [override, setOverride] = createSignal<boolean>();
	const active = () => override() ?? when();

	createEffect(() => {
		if (typeof window === "undefined" || !active()) return;
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", handler);
		onCleanup(() => window.removeEventListener("beforeunload", handler));
	});

	return {
		active,
		enable: () => setOverride(true),
		disable: () => setOverride(false),
	};
}
