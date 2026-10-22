import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface HashControls {
	/** Current hash without the leading `#` — "" when unset */
	hash: Accessor<string>;
	/** Navigate to a hash — accepts "#section" or "section" */
	setHash: (next: string) => void;
}

/**
 * Reactive `location.hash` — updates on `hashchange` (back/forward, anchor
 * clicks) and exposes `setHash` for programmatic navigation. SSR-safe:
 * `hash()` starts "" and `setHash` is a no-op.
 *
 * @returns `{ hash, setHash }` controls
 *
 * @example
 * const { hash, setHash } = useHash();
 * <button onClick={() => setHash("docs")} class={hash() === "docs" ? "active" : ""}>Docs</button>
 */
export function useHash(): HashControls {
	const [hash, setHashSignal] = createSignal("");

	onMount(() => {
		const read = () => setHashSignal(window.location.hash.replace(/^#/, ""));
		read();
		window.addEventListener("hashchange", read);
		onCleanup(() => window.removeEventListener("hashchange", read));
	});

	const setHash = (next: string) => {
		if (typeof window === "undefined") return;
		window.location.hash = next.replace(/^#/, "");
		// hashchange doesn't fire for a same-value write — stay in sync eagerly.
		setHashSignal(window.location.hash.replace(/^#/, ""));
	};

	return { hash, setHash };
}
