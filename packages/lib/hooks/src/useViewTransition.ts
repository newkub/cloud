import { type Accessor, createSignal } from "solid-js";

export interface ViewTransitionLike {
	/** Resolves when the pseudo-element tree is ready and the animation is about to start */
	readonly ready: Promise<void>;
	/** Resolves once the update callback has finished mutating the DOM */
	readonly updateCallbackDone: Promise<void>;
	/** Resolves when the whole transition animation ends — rejects if skipped */
	readonly finished: Promise<void>;
	/** Skip the animation phase — the DOM update still runs */
	skipTransition(): void;
}

type DocumentWithViewTransition = Document & {
	startViewTransition?: (cb: () => void | Promise<void>) => ViewTransitionLike;
};

export interface ViewTransitionControls {
	/** Whether `document.startViewTransition` exists */
	supported: boolean;
	/** True while a transition's `finished` promise is still pending */
	transitioning: Accessor<boolean>;
	/**
	 * Run `cb` inside a view transition. When unsupported the callback runs
	 * immediately and `undefined` is returned, so callers never branch.
	 */
	start: (cb: () => void | Promise<void>) => ViewTransitionLike | undefined;
}

/**
 * View Transitions API — animates a DOM mutation (`cb`) between the old and
 * new render. Falls back to running the callback synchronously where
 * `document.startViewTransition` is missing.
 *
 * @returns `{ supported, transitioning, start }`
 *
 * @example
 * const vt = useViewTransition();
 * <button onClick={() => vt.start(() => setPage("settings"))}>switch page</button>
 */
export function useViewTransition(): ViewTransitionControls {
	const supported =
		typeof document !== "undefined" &&
		typeof (document as DocumentWithViewTransition).startViewTransition === "function";
	const [transitioning, setTransitioning] = createSignal(false);

	const start = (cb: () => void | Promise<void>) => {
		if (typeof document === "undefined") {
			void cb();
			return undefined;
		}
		const api = (document as DocumentWithViewTransition).startViewTransition;
		if (!api) {
			void cb();
			return undefined;
		}
		setTransitioning(true);
		const transition = api.call(document, cb);
		const done = () => setTransitioning(false);
		transition.finished.then(done, done);
		return transition;
	};

	return { supported, transitioning, start };
}
