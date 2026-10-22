import type { Accessor } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

const SELECTOR = '[aria-invalid]:not([aria-invalid="false"])';

/**
 * Focus the first invalid field — returns a `focus()` fn that finds the
 * first `[aria-invalid]` descendant (skipping `aria-invalid="false"`) of the
 * target form, scrolls it into view and focuses it. Returns whether a field
 * was found. SSR-safe: no-ops when the element or DOM is unavailable.
 *
 * @param target — Form element or an accessor resolving to one (e.g. `() => formEl`)
 * @returns `focus() => boolean` — true when an invalid field was focused
 *
 * @example
 * let formEl: HTMLFormElement | undefined;
 * const focusFirstError = useFocusFirstError(() => formEl);
 * const onSubmit = async (e: Event) => {
 *   e.preventDefault();
 *   if (!form.validateAll()) focusFirstError();
 * };
 * <form ref={formEl} onSubmit={onSubmit}>…</form>
 */
export function useFocusFirstError(target: MaybeAccessor<HTMLElement | undefined>) {
	return (): boolean => {
		const el = read(target);
		if (typeof el?.querySelector !== "function") return false;
		const field = el.querySelector<HTMLElement>(SELECTOR);
		if (!field) return false;
		field.scrollIntoView({ behavior: "smooth", block: "center" });
		field.focus({ preventScroll: true });
		return true;
	};
}
