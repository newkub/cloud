import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface MidiPortLike {
	readonly id: string;
	readonly name?: string;
	readonly manufacturer?: string;
	readonly state?: string;
	readonly type?: string;
}

interface MidiAccessLike extends EventTarget {
	readonly inputs: ReadonlyMap<string, MidiPortLike>;
	readonly outputs: ReadonlyMap<string, MidiPortLike>;
}

type RequestMidiAccess = (options?: { sysex?: boolean }) => Promise<MidiAccessLike>;

const requestMidiAccess = (): RequestMidiAccess | undefined =>
	typeof navigator === "undefined"
		? undefined
		: (navigator as { requestMIDIAccess?: RequestMidiAccess }).requestMIDIAccess;

export interface MidiState {
	/** `navigator.requestMIDIAccess` support flag */
	supported: boolean;
	/** Connected MIDI input ports — refreshes on every `statechange` */
	inputs: Accessor<readonly MidiPortLike[]>;
	/** Connected MIDI output ports — refreshes on every `statechange` */
	outputs: Accessor<readonly MidiPortLike[]>;
	/** Last `requestMIDIAccess` error message (permission denied included) */
	error: Accessor<string | undefined>;
}

/**
 * Web MIDI as signals — requests `navigator.requestMIDIAccess()` on mount and
 * mirrors `inputs`/`outputs` port lists, re-reading them on every `statechange`
 * event (device hot-plug, port connect/disconnect). Degrades to
 * `supported: false` + empty lists where the API is missing — never throws.
 *
 * @param options — `{ sysex: true }` to request System Exclusive access
 * @returns `{ supported, inputs, outputs, error }`
 *
 * @example
 * const midi = useMidi();
 * <For each={midi.inputs()}>{(input) => <li>{input.name}</li>}</For>
 */
export function useMidi(options?: { sysex?: boolean }): MidiState {
	const request = requestMidiAccess();
	const supported = typeof request === "function";
	const [inputs, setInputs] = createSignal<readonly MidiPortLike[]>([]);
	const [outputs, setOutputs] = createSignal<readonly MidiPortLike[]>([]);
	const [error, setError] = createSignal<string>();
	let access: MidiAccessLike | undefined;

	const read = () => {
		setInputs(access ? [...access.inputs.values()] : []);
		setOutputs(access ? [...access.outputs.values()] : []);
	};

	onMount(() => {
		if (!request) return;
		request(options?.sysex ? { sysex: true } : undefined)
			.then((a) => {
				access = a;
				read();
				a.addEventListener("statechange", read);
			})
			.catch((e) => setError(e instanceof Error ? e.message : "requestMIDIAccess failed"));
	});

	onCleanup(() => access?.removeEventListener("statechange", read));

	return { supported, inputs, outputs, error };
}
