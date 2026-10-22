import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

interface ChordStep {
	key: string;
	ctrl: boolean;
	shift: boolean;
	alt: boolean;
	meta: boolean;
}

/** `"ctrl+shift+k"` → `{ key: "k", ctrl: true, shift: true, ... }` */
const parseStep = (raw: string): ChordStep => {
	const tokens = raw.toLowerCase().split("+").filter(Boolean);
	const step: ChordStep = { key: "", ctrl: false, shift: false, alt: false, meta: false };
	for (const t of tokens) {
		if (t === "ctrl" || t === "control") step.ctrl = true;
		else if (t === "shift") step.shift = true;
		else if (t === "alt" || t === "option") step.alt = true;
		else if (t === "meta" || t === "cmd" || t === "command" || t === "mod") step.meta = true;
		else step.key = t;
	}
	return step;
};

const matches = (e: KeyboardEvent, step: ChordStep): boolean =>
	e.key.toLowerCase() === step.key &&
	e.ctrlKey === step.ctrl &&
	e.shiftKey === step.shift &&
	e.altKey === step.alt &&
	e.metaKey === step.meta;

export interface KeyChordControls {
	/** Number of chord steps matched so far — resets to 0 on completion or timeout */
	progress: Accessor<number>;
	/** Forget any partial chord in progress */
	reset: () => void;
}

/**
 * Fire a callback after a multi-step key chord — `"ctrl+k d"` means Ctrl+K
 * then D, each step within `timeoutMs` of the last. A mismatched key resets
 * progress (then restarts the chord if it matches step one). Listens on
 * `target` or window; SSR-safe.
 *
 * @param chord — Space-separated steps, each `"mod+key"` (e.g. `"ctrl+k ctrl+d"`)
 * @param handler — Called when the full chord completes
 * @param options — `timeoutMs` between steps, `target`, `preventDefault`. @default timeoutMs 1000
 * @returns `{ progress, reset }`
 *
 * @example
 * useKeyChord("ctrl+k d", () => openDashboard());
 */
export function useKeyChord(
	chord: string,
	handler: (e: KeyboardEvent) => void,
	options?: {
		/** Max ms between steps before the chord resets. @default 1000 */
		timeoutMs?: number;
		/** Element/accessor to listen on — defaults to window */
		target?: MaybeAccessor<HTMLElement | Window | Document | undefined>;
		/** `preventDefault()` on the completing keydown. @default false */
		preventDefault?: boolean;
	},
): KeyChordControls {
	const steps = chord.split(/\s+/).filter(Boolean).map(parseStep);
	const timeout = options?.timeoutMs ?? 1000;
	const [progress, setProgress] = createSignal(0);
	let index = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const reset = () => {
		index = 0;
		setProgress(0);
		clearTimeout(timer);
		timer = undefined;
	};
	const arm = () => {
		clearTimeout(timer);
		timer = setTimeout(reset, timeout);
	};
	const advance = (e: KeyboardEvent) => {
		index++;
		setProgress(index);
		if (index >= steps.length) {
			reset();
			if (options?.preventDefault) e.preventDefault();
			handler(e);
		} else {
			arm();
		}
	};

	createEffect(() => {
		if (typeof window === "undefined" || steps.length === 0) return;
		const el = options?.target === undefined ? window : read(options.target);
		if (!el) return;
		const onKey = (e: KeyboardEvent) => {
			const step = steps[index];
			if (step && matches(e, step)) {
				advance(e);
			} else {
				reset();
				// A mismatch may itself be the first step of a fresh attempt
				const first = steps[0];
				if (first && matches(e, first)) advance(e);
			}
		};
		el.addEventListener("keydown", onKey as EventListener);
		onCleanup(() => {
			reset();
			el.removeEventListener("keydown", onKey as EventListener);
		});
	});

	return { progress, reset };
}
