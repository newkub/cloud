import { type Accessor, createMemo, createSignal } from "solid-js";
import { useMultiStep } from "./useMultiStep";

export interface TourStep {
	/** CSS selector for the element to highlight — scrolled into view on each step */
	target?: string;
	/** Step heading */
	title: string;
	/** Step body copy */
	content: string;
}

export interface TourControls {
	/** Current step object — `undefined` when the list is empty */
	step: Accessor<TourStep | undefined>;
	/** Current step index, 0-based */
	index: Accessor<number>;
	/** Advance — on the last step finishes the tour (`active()` → false) */
	next: () => void;
	/** Go back one step — clamps on the first step */
	back: () => void;
	/** End the tour immediately */
	skip: () => void;
	/** (Re)start the tour from step 0 */
	start: () => void;
	/** True while the tour is running */
	active: Accessor<boolean>;
	/** True on the first step */
	isFirst: Accessor<boolean>;
	/** True on the last step */
	isLast: Accessor<boolean>;
}

/**
 * Guided-tour state over a list of steps — composes {@link useMultiStep}
 * for clamped `next`/`back` navigation and adds `start`/`skip`/`active`.
 * When a step carries a `target` selector its element is scrolled into view
 * (`document.querySelector`) as the step becomes current.
 *
 * @param steps — Tour steps, static or reactive accessor
 * @returns `{ step, index, next, back, skip, start, active, isFirst, isLast }`
 *
 * @example
 * const tour = useTour([{ target: "#save", title: "Save", content: "Click to save." }]);
 * <Show when={tour.active()}>
 *   <Popover>{tour.step()?.title}<button onClick={tour.next}>next</button></Popover>
 * </Show>
 */
export function useTour(steps: TourStep[] | Accessor<TourStep[]>): TourControls {
	const list = () => (typeof steps === "function" ? (steps as Accessor<TourStep[]>)() : steps);
	const ms = useMultiStep(Math.max(1, list().length));
	const [active, setActive] = createSignal(false);

	const focusTarget = () => {
		if (typeof document === "undefined") return;
		const sel = list()[ms.step()]?.target;
		if (!sel) return;
		document.querySelector(sel)?.scrollIntoView({ behavior: "smooth", block: "center" });
	};

	const start = () => {
		ms.goTo(0);
		setActive(true);
		focusTarget();
	};

	const next = () => {
		if (ms.isLast()) {
			setActive(false);
			return;
		}
		ms.next();
		focusTarget();
	};

	const back = () => {
		ms.back();
		focusTarget();
	};

	return {
		step: createMemo(() => list()[ms.step()]),
		index: ms.step,
		next,
		back,
		skip: () => setActive(false),
		start,
		active,
		isFirst: ms.isFirst,
		isLast: ms.isLast,
	};
}
