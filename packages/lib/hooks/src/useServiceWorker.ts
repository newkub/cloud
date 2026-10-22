import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface ServiceWorkerState {
	/** `navigator.serviceWorker` support flag */
	supported: boolean;
	/** The current registration — undefined until fetched or when unsupported */
	registration: Accessor<ServiceWorkerRegistration | undefined>;
	/** State of the active worker ("installing" | "waiting" | "activating" | "activated" …) */
	state: Accessor<string | undefined>;
	/** Last error message */
	error: Accessor<string | undefined>;
	/** Ask the registration to check for an updated script — `false` when unsupported */
	update: () => Promise<boolean>;
	/** Re-run `getRegistration()` — resolves the registration or `undefined` */
	refresh: () => Promise<ServiceWorkerRegistration | undefined>;
}

/**
 * Service Worker lifecycle — fetches the current registration on mount,
 * mirrors the active worker's `state`, and tracks `updatefound` /
 * `controllerchange` so a new worker is reflected reactively. `update()`
 * proxies `registration.update()`.
 *
 * @returns `{ supported, registration, state, error, update, refresh }`
 *
 * @example
 * const sw = useServiceWorker();
 * <Show when={sw.state() === "waiting"}>
 *   <button onClick={() => sw.update()}>update available</button>
 * </Show>
 */
export function useServiceWorker(): ServiceWorkerState {
	const container = typeof navigator === "undefined" ? undefined : navigator.serviceWorker;
	const supported = typeof navigator !== "undefined" && "serviceWorker" in navigator;
	const [registration, setRegistration] = createSignal<ServiceWorkerRegistration>();
	const [state, setState] = createSignal<string>();
	const [error, setError] = createSignal<string>();

	const track = (reg: ServiceWorkerRegistration) => {
		setRegistration(reg);
		setState(reg.active?.state ?? reg.waiting?.state ?? reg.installing?.state);
		const onUpdateFound = () => {
			const worker = reg.installing;
			setState(worker?.state);
			worker?.addEventListener("statechange", () => setState(worker.state));
		};
		reg.addEventListener?.("updatefound", onUpdateFound);
	};

	onMount(() => {
		if (!container) return;
		container
			.getRegistration()
			.then((reg) => {
				if (reg) track(reg);
				setError(undefined);
			})
			.catch((e) => setError(e instanceof Error ? e.message : "getRegistration failed"));
		const onControllerChange = () => {
			container
				.getRegistration()
				.then((reg) => reg && track(reg))
				.catch(() => {});
		};
		container.addEventListener?.("controllerchange", onControllerChange);
		onCleanup(() => container.removeEventListener?.("controllerchange", onControllerChange));
	});

	return {
		supported,
		registration,
		state,
		error,
		update: async () => {
			const reg = registration();
			if (!reg) return false;
			try {
				await reg.update();
				setError(undefined);
				return true;
			} catch (e) {
				setError(e instanceof Error ? e.message : "update failed");
				return false;
			}
		},
		refresh: async () => {
			if (!container) return undefined;
			try {
				const reg = await container.getRegistration();
				if (reg) track(reg);
				setError(undefined);
				return reg;
			} catch (e) {
				setError(e instanceof Error ? e.message : "getRegistration failed");
				return undefined;
			}
		},
	};
}
