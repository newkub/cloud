import { type Accessor, createSignal } from "solid-js";

export interface MachineState<S extends string, E extends string> {
	on?: Partial<Record<E, S>>;
	/** Runs when the machine enters this state. */
	onEntry?: (state: S) => void;
	/** Runs when the machine leaves this state. */
	onExit?: (state: S) => void;
}

export interface MachineConfig<S extends string, E extends string> {
	initial: S;
	states: Record<S, MachineState<S, E>>;
}

export interface MachineControls<S extends string, E extends string> {
	/** Current state. */
	state: Accessor<S>;
	/** Send an event — returns true when it caused a transition. */
	send: (event: E) => boolean;
	/** `matches("idle")` or `matches("a", "b")` — true if in any listed state. */
	matches: (...states: S[]) => boolean;
	/** True when the current state has no outgoing transitions. */
	isFinal: () => boolean;
	/** Whether `event` would transition from the current state. */
	can: (event: E) => boolean;
	/** Jump back to `initial`. */
	reset: () => void;
}

/**
 * Tiny finite state machine — explicit `states.on` transition table with
 * optional per-state `onEntry`/`onExit` hooks. `send` reports whether a
 * transition happened; unknown events are no-ops.
 *
 * @param config - `{ initial, states }`
 * @returns `{ state, send, matches, isFinal, can, reset }`
 *
 * @example
 * const m = useMachine({
 *   initial: "idle",
 *   states: { idle: { on: { START: "running" } }, running: { on: { STOP: "idle" } } },
 * });
 * m.send("START"); // true — state() === "running"
 */
export function useMachine<S extends string, E extends string>(config: MachineConfig<S, E>): MachineControls<S, E> {
	const [state, setState] = createSignal<S>(config.initial);
	const send = (event: E): boolean => {
		const current = state();
		const next = config.states[current]?.on?.[event];
		if (next === undefined) return false;
		config.states[current]?.onExit?.(current);
		setState(() => next);
		config.states[next]?.onEntry?.(next);
		return true;
	};
	return {
		state,
		send,
		matches: (...states) => states.includes(state()),
		isFinal: () => Object.keys(config.states[state()]?.on ?? {}).length === 0,
		can: (e) => config.states[state()]?.on?.[e] !== undefined,
		reset: () => {
			config.states[state()]?.onExit?.(state());
			setState(() => config.initial);
			config.states[config.initial]?.onEntry?.(config.initial);
		},
	};
}
