import { createEffect, onCleanup } from "solid-js";

export interface UseTextareaAutosizeOptions {
	/** Reactive trigger — whenever this accessor's value changes the textarea re-sizes. */
	watch?: () => unknown;
	/** Called with the element after every resize. */
	callback?: (el: HTMLTextAreaElement) => void;
}

export interface UseTextareaAutosizeReturn {
	/** Attach to a `<textarea>` with `ref={api.textareaRef}` — wires up listeners and sizes it. */
	textareaRef: (el: HTMLTextAreaElement) => void;
	/** Force a re-measure (auto-height then set to `scrollHeight`). */
	resize: () => void;
}

/**
 * Auto-grow a `<textarea>` to fit its content. Bind the element through the
 * returned `textareaRef` callback ref; the hook resets `height` to `auto`,
 * then to `scrollHeight` on mount, on every `input` event and whenever the
 * optional `watch` accessor changes. Listeners are removed on cleanup.
 *
 * @param options — See {@link UseTextareaAutosizeOptions}
 * @returns `{ textareaRef, resize }`
 *
 * @example
 * const autosize = useTextareaAutosize();
 * <textarea ref={autosize.textareaRef} rows={1} />
 */
export function useTextareaAutosize(options?: UseTextareaAutosizeOptions): UseTextareaAutosizeReturn {
	let el: HTMLTextAreaElement | undefined;

	const resize = () => {
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${el.scrollHeight}px`;
		options?.callback?.(el);
	};

	const onInput = () => resize();

	if (options?.watch) {
		createEffect(() => {
			options.watch?.();
			resize();
		});
	}

	const setTextarea = (next: HTMLTextAreaElement) => {
		if (el === next) return;
		if (el) el.removeEventListener("input", onInput);
		el = next;
		el.addEventListener("input", onInput);
		resize();
	};

	onCleanup(() => {
		if (el) el.removeEventListener("input", onInput);
	});

	return { textareaRef: setTextarea, resize };
}
