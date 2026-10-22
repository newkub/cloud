import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export type ScriptStatus = "idle" | "loading" | "ready" | "error";

export interface ScriptOptions {
	/** `script.async` — disable to preserve execution order. @default true */
	async?: boolean;
	/** `script.defer` — defer execution until the document parses. @default false */
	defer?: boolean;
	/** `script.crossOrigin` — e.g. `"anonymous"` for CORS-enabled CDNs */
	crossOrigin?: string;
	/** Extra attributes applied via `setAttribute` (integrity, nonce, data-*) */
	attrs?: Record<string, string>;
}

/**
 * Inject an external `<script>` — reactive loading status + cleanup.
 * Use to lazily load SDKs (Stripe.js, analytics, widgets).
 * Re-injects when `src()` changes; removes the tag on cleanup.
 * The returned accessor doubles as a loading flag: `status() === "loading"`.
 *
 * @param src — Accessor for the script URL
 * @param options — `async`/`defer`/`crossOrigin` flags plus arbitrary `attrs`
 * @returns Accessor for `"idle" | "loading" | "ready" | "error"`
 *
 * @example
 * const stripe = useScript(() => "https://js.stripe.com/v3/", { attrs: { nonce } });
 * <Show when={stripe() === "ready"}>load stripe.js</Show>
 */
export function useScript(src: Accessor<string>, options?: ScriptOptions): Accessor<ScriptStatus> {
	const [status, setStatus] = createSignal<ScriptStatus>("idle");

	createEffect(() => {
		const target = src();
		setStatus("loading");
		const tag = document.createElement("script");
		tag.src = target;
		tag.async = options?.async ?? true;
		if (options?.defer) tag.defer = true;
		if (options?.crossOrigin) tag.crossOrigin = options.crossOrigin;
		for (const [name, value] of Object.entries(options?.attrs ?? {})) tag.setAttribute(name, value);
		tag.onload = () => setStatus("ready");
		tag.onerror = () => setStatus("error");
		document.head.appendChild(tag);
		onCleanup(() => {
			tag.onload = null;
			tag.onerror = null;
			tag.remove();
		});
	});

	return status;
}
