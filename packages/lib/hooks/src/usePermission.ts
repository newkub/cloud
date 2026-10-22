import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export type PermissionResult = PermissionState | "unsupported" | "unknown";

/**
 * Reactive `navigator.permissions.query` — tracks changes via `status.onchange`.
 *
 * @param name — Permission name, e.g. `"notifications"`, `"geolocation"`
 * @param onChange — Optional callback fired with the new state on every change
 * @returns Accessor for `"granted" | "denied" | "prompt" | "unsupported" | "unknown"`
 *
 * @example
 * const notif = usePermission("notifications", (s) => console.log("perm →", s));
 * <Show when={notif() === "granted"}><PushButton /></Show>
 */
export function usePermission(
	name: PermissionName,
	onChange?: (state: PermissionResult) => void,
): Accessor<PermissionResult> {
	const [state, setState] = createSignal<PermissionResult>("unknown");

	onMount(() => {
		if (!navigator.permissions?.query) {
			setState("unsupported");
			return;
		}
		let status: PermissionStatus | undefined;
		navigator.permissions
			.query({ name })
			.then((s) => {
				status = s;
				setState(s.state);
				s.onchange = () => {
					setState(s.state);
					onChange?.(s.state);
				};
			})
			.catch(() => setState("unsupported"));
		onCleanup(() => {
			if (status) status.onchange = null;
		});
	});

	return state;
}
