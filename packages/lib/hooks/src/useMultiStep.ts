import { type Accessor, createMemo, createSignal } from "solid-js";

export interface MultiStepControls {
	/** Current step index, 0-based */
	step: Accessor<number>;
	/** Advance one step — clamps on the last step */
	next: () => void;
	/** Go back one step — clamps on the first step */
	back: () => void;
	/** Jump to a step — clamped to `0 .. count - 1` */
	goTo: (index: number) => void;
	/** True on the first step */
	isFirst: Accessor<boolean>;
	/** True on the last step */
	isLast: Accessor<boolean>;
	/** `0 .. 1` — `(step + 1) / count`, so the last step reads 1 */
	progress: Accessor<number>;
}

/**
 * Multi-step flow position — clamped `goTo`, `next`/`back` that stop at both
 * ends, and a `progress` fraction for bars. `onStepChange` fires after every
 * actual change.
 *
 * @param count — Number of steps (≥ 1)
 * @param options — `initial` starting step, `onStepChange` change callback
 * @returns `{ step, next, back, goTo, isFirst, isLast, progress }`
 *
 * @example
 * const wiz = useMultiStep(3, { onStepChange: (s) => console.log("step", s) });
 * <For each={steps}>{(_, i) => <i class={i() === wiz.step() ? "on" : ""} />}</For>
 * <button onClick={wiz.back} disabled={wiz.isFirst()}>back</button>
 * <button onClick={wiz.next} disabled={wiz.isLast()}>next</button>
 */
export function useMultiStep(
	count: number,
	options?: {
		/** Starting step index. @default 0 */
		initial?: number;
		/** Called after every actual step change with the new index. */
		onStepChange?: (step: number) => void;
	},
): MultiStepControls {
	const total = Math.max(1, Math.floor(count));
	const clamp = (n: number) => Math.min(Math.max(0, Math.round(n)), total - 1);
	const [step, setStepRaw] = createSignal(clamp(options?.initial ?? 0));

	const setStep = (n: number) => {
		const next = clamp(n);
		const changed = next !== step();
		setStepRaw(next);
		if (changed) options?.onStepChange?.(next);
	};

	return {
		step,
		next: () => setStep(step() + 1),
		back: () => setStep(step() - 1),
		goTo: setStep,
		isFirst: createMemo(() => step() === 0),
		isLast: createMemo(() => step() === total - 1),
		progress: createMemo(() => (step() + 1) / total),
	};
}
