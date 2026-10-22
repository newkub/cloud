import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface TimeoutControls {
	/** True while a callback is scheduled */
	pending: Accessor<boolean>;
	/** Arm the timer — cancels any pending countdown first */
	start: () => void;
	/** Cancel the pending timer without running the callback */
	cancel: () => void;
}

/**
 * Declarative `setTimeout` — runs `fn` once after `ms` unless cancelled.
 * `start()` re-arms the timer so it can be reused; `pending()` reports
 * whether a callback is currently scheduled. SSR-safe: never fires
 * before mount.
 *
 * @param fn — Callback to run when the timer fires
 * @param ms — Delay in milliseconds
 * @param options — `immediate` arms the timer on mount
 * @returns `{ pending, start, cancel }` controls + accessor
 *
 * @example
 * const toast = useTimeout(() => setShow(false), 3000, { immediate: false });
 * <button onClick={toast.start}>show toast for 3s</button>
 */
export function useTimeout(
	fn: () => void,
	ms: number,
	options?: {
		/** Arm the timer on mount. @default true */
		immediate?: boolean;
	},
): TimeoutControls {
	const [pending, setPending] = createSignal(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const cancel = () => {
		clearTimeout(timer);
		timer = undefined;
		setPending(false);
	};

	const start = () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = undefined;
			setPending(false);
			fn();
		}, ms);
		setPending(true);
	};

	onMount(() => {
		if (options?.immediate !== false) start();
		onCleanup(cancel);
	});

	return { pending, start, cancel };
}
