import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

const isTypingTarget = (t: EventTarget | null) =>
	t instanceof HTMLElement && (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) || t.isContentEditable);

/**
 * Konami-style key sequence matcher — returns true once the user presses the
 * keys in order. Progress resets on a wrong key or after `timeout` ms of
 * silence; `matched` clears on the next keydown. Keys are compared against
 * `event.key.toLowerCase()`; typing in form fields is ignored. SSR-safe.
 *
 * @param sequence — Ordered `KeyboardEvent.key` values (array or accessor)
 * @param options — `timeout` between keys in ms. @default 1000
 * @returns Accessor for the matched flag
 *
 * @example
 * const konami = useKeySequence(["arrowup", "arrowup", "arrowdown", "arrowdown"]);
 * <Show when={konami()}>Secret unlocked</Show>
 */
export function useKeySequence(
	sequence: MaybeAccessor<readonly string[]>,
	options?: {
		/** Max ms between keys before progress resets. @default 1000 */
		timeout?: number;
		/** Called when the full sequence matches. */
		onMatch?: () => void;
	},
): Accessor<boolean> {
	const timeout = options?.timeout ?? 1000;
	const [matched, setMatched] = createSignal(false);
	let progress = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const onKeyDown = (e: KeyboardEvent) => {
		if (isTypingTarget(e.target)) return;
		const seq = read(sequence);
		if (seq.length === 0) return;
		const key = e.key.toLowerCase();
		setMatched(false);

		// Allow restart: a wrong key that equals the first key restarts progress.
		progress = seq[progress]?.toLowerCase() === key ? progress + 1 : seq[0]?.toLowerCase() === key ? 1 : 0;

		if (progress === seq.length) {
			progress = 0;
			setMatched(true);
			options?.onMatch?.();
			return;
		}

		clearTimeout(timer);
		if (progress > 0) timer = setTimeout(() => (progress = 0), timeout);
	};

	onMount(() => {
		window.addEventListener("keydown", onKeyDown);
		onCleanup(() => {
			clearTimeout(timer);
			window.removeEventListener("keydown", onKeyDown);
		});
	});

	return matched;
}
