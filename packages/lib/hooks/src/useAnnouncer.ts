import { type Accessor, createEffect, createSignal, type JSX, onCleanup } from "solid-js";

export type Politeness = "polite" | "assertive";

export interface AnnouncerOptions {
	/** Default `aria-live` politeness. @default "polite" */
	politeness?: Politeness;
	/** Milliseconds before a message auto-clears. @default 5000 */
	timeout?: number;
}

export interface AnnounceCallOptions {
	/** Per-call politeness override — falls back to `AnnouncerOptions.politeness`. */
	politeness?: Politeness;
}

export interface AnnouncerControls {
	/** Post a message to the live region — re-announces identical text, auto-clears after `timeout` */
	announce: (message: string, options?: AnnounceCallOptions) => void;
	/** Visually-hidden `aria-live` region — render it once near the app root. `null` during SSR */
	node: JSX.Element;
	/** Currently announced message */
	message: Accessor<string>;
	/** Politeness in effect for the current message */
	politeness: Accessor<Politeness>;
}

/**
 * Screen-reader announcements via a visually-hidden `aria-live` region —
 * `announce(msg)` posts text (polite by default, assertive per option or
 * per-call), repeats of the same string still mutate the DOM, and the message
 * auto-clears after `timeout` ms. Consumers render `{announcer.node}` once.
 *
 * @param options — `politeness` default and `timeout` for auto-clearing
 * @returns `{ announce, node, message, politeness }`
 *
 * @example
 * const announcer = useAnnouncer({ timeout: 4000 });
 * <button onClick={() => announcer.announce("Saved", { politeness: "assertive" })}>save</button>
 * {announcer.node}
 */
export function useAnnouncer(options?: AnnouncerOptions): AnnouncerControls {
	const fallback = options?.politeness ?? "polite";
	const timeout = options?.timeout ?? 5000;
	const [message, setMessage] = createSignal("");
	const [politeness, setPoliteness] = createSignal<Politeness>(fallback);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const announce = (msg: string, opts?: AnnounceCallOptions) => {
		setPoliteness(opts?.politeness ?? fallback);
		// Clearing first guarantees a DOM mutation even when the text repeats.
		setMessage("");
		setMessage(msg);
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => setMessage(""), timeout);
	};
	onCleanup(() => {
		if (timer) clearTimeout(timer);
	});

	const node = (() => {
		if (typeof document === "undefined") return null;
		const el = document.createElement("div");
		el.setAttribute("role", "status");
		el.setAttribute("aria-atomic", "true");
		Object.assign(el.style, {
			position: "absolute",
			width: "1px",
			height: "1px",
			padding: "0",
			margin: "-1px",
			overflow: "hidden",
			clip: "rect(0 0 0 0)",
			whiteSpace: "nowrap",
			border: "0",
		});
		createEffect(() => {
			el.setAttribute("aria-live", politeness());
			el.textContent = message();
		});
		return el;
	})();

	return { announce, node, message, politeness };
}
