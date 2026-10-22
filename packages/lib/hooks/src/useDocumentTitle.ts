import { type Accessor, createEffect, onCleanup } from "solid-js";

export interface DocumentTitleOptions {
	/** Wrap the raw title — e.g. `(t) => \`${t} — My App\`` */
	template?: (title: string) => string;
	/** Restore the previous title on cleanup. @default true */
	restoreOnUnmount?: boolean;
}

/**
 * Keep `document.title` in sync with a reactive value; restores the
 * previous title on cleanup (unless `restoreOnUnmount: false`).
 * No-op during SSR/prerender.
 *
 * @param title — Accessor for the desired document title
 * @param options — `template` formats the title; `restoreOnUnmount` restores on cleanup
 *
 * @example
 * useDocumentTitle(() => page(), { template: (t) => `${t} — My App` });
 */
export function useDocumentTitle(title: Accessor<string>, options?: DocumentTitleOptions) {
	if (typeof document === "undefined") return;
	const previous = document.title;
	createEffect(() => {
		const t = title();
		document.title = options?.template ? options.template(t) : t;
	});
	onCleanup(() => {
		if (options?.restoreOnUnmount ?? true) document.title = previous;
	});
}
