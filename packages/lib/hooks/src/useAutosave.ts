import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface AutosaveState {
	/** True while a save is in flight. */
	saving: Accessor<boolean>;
	/** Timestamp of the last successful save. */
	savedAt: Accessor<Date | undefined>;
	/** Last save error, cleared on the next attempt. */
	error: Accessor<Error | undefined>;
	/** Cancel the pending debounce and save the current value immediately. */
	saveNow: () => Promise<void>;
}

/**
 * Debounced autosave — watches `value` and calls `save` after `ms` of quiet.
 * The initial value never triggers a save. `saveNow` flushes immediately.
 * Timers clean up on dispose; safe under SSR (effects don't run server-side).
 *
 * @param value — Accessor holding the value to persist
 * @param save — Sync or async save function receiving the latest value
 * @param options — `ms` debounce delay. @default 1000
 * @returns `{ saving, savedAt, error, saveNow }`
 *
 * @example
 * const [draft, setDraft] = createSignal("");
 * const save = useAutosave(draft, (v) => api.put("/draft", v), { ms: 800 });
 * <textarea onInput={(e) => setDraft(e.currentTarget.value)} />
 * <Show when={save.saving()}>saving…</Show>
 */
export function useAutosave<T>(
	value: Accessor<T>,
	save: (value: T) => void | Promise<void>,
	options?: { ms?: number },
): AutosaveState {
	const ms = options?.ms ?? 1000;
	const [saving, setSaving] = createSignal(false);
	const [savedAt, setSavedAt] = createSignal<Date>();
	const [error, setError] = createSignal<Error>();
	let timer: ReturnType<typeof setTimeout> | undefined;
	let inFlight = 0;
	let first = true;

	const run = async (v: T) => {
		inFlight++;
		setSaving(true);
		setError(undefined);
		try {
			await save(v);
			setSavedAt(new Date());
		} catch (e) {
			setError(e as Error);
		} finally {
			inFlight--;
			if (inFlight === 0) setSaving(false);
		}
	};

	const saveNow = async () => {
		clearTimeout(timer);
		timer = undefined;
		await run(value());
	};

	createEffect(() => {
		const v = value();
		if (first) {
			first = false;
			return;
		}
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = undefined;
			void run(v);
		}, ms);
	});

	onCleanup(() => clearTimeout(timer));

	return { saving, savedAt, error, saveNow };
}
