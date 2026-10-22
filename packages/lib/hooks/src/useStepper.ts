import { type Accessor, createMemo, createSignal } from "solid-js";

export interface StepperControls {
	/** Current step index, 0-based. */
	step: Accessor<number>;
	/** Advance one step — wraps to 0 when `loop` and on the last step. */
	next: () => void;
	/** Go back one step — wraps to the last when `loop` and on the first step. */
	prev: () => void;
	/** Jump to a step — clamped to `0 .. total - 1`. */
	goTo: (step: number) => void;
	/** True on the first step. */
	isFirst: Accessor<boolean>;
	/** True on the last step. */
	isLast: Accessor<boolean>;
	/** `0 .. 1` — `(step + 1) / total`, so the last step reads 1. */
	progress: Accessor<number>;
}

/**
 * Wizard/stepper position — 0-based `step` with clamped `goTo`, optional
 * wrap-around `next`/`prev`, and a `progress` fraction for bars.
 *
 * @param total — Number of steps (≥ 1)
 * @param options — `initial` starting step, `loop` wraps at both ends
 * @returns `{ step, next, prev, goTo, isFirst, isLast, progress }`
 *
 * @example
 * const wiz = useStepper(3, { loop: true });
 * <progress value={wiz.progress()} />
 * <button onClick={wiz.prev} disabled={wiz.isFirst()}>back</button>
 * <button onClick={wiz.next}>{wiz.isLast() ? "finish" : "next"}</button>
 */
export function useStepper(total: number, options?: { initial?: number; loop?: boolean }): StepperControls {
	const count = Math.max(1, Math.floor(total));
	const clamp = (n: number) => Math.min(Math.max(0, Math.round(n)), count - 1);
	const [step, setStep] = createSignal(clamp(options?.initial ?? 0));

	const isFirst = createMemo(() => step() === 0);
	const isLast = createMemo(() => step() === count - 1);
	const progress = createMemo(() => (step() + 1) / count);

	const next = () => setStep((s) => (s >= count - 1 ? (options?.loop ? 0 : s) : s + 1));
	const prev = () => setStep((s) => (s <= 0 ? (options?.loop ? count - 1 : s) : s - 1));
	const goTo = (n: number) => setStep(clamp(n));

	return { step, next, prev, goTo, isFirst, isLast, progress };
}
