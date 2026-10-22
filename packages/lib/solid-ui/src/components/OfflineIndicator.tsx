/**
 * OfflineIndicator — banner that appears while the browser is offline.
 */
import { createSignal, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface OfflineIndicatorProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Banner text @default "You are offline — changes may not sync" */
	message?: string;
	/** Show a brief "Back online" confirmation @default true */
	showReconnected?: boolean;
	/** Reconnected message @default "Back online" */
	reconnectedMessage?: string;
	/** Position @default "top" */
	position?: "top" | "bottom";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function OfflineIndicator(props: OfflineIndicatorProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"message",
		"reconnectedMessage",
		"showReconnected",
		"position",
		"radius",
		"elevation",
	]);
	const [offline, setOffline] = createSignal(false);
	const [reconnected, setReconnected] = createSignal(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const onOffline = () => {
		setOffline(true);
		setReconnected(false);
	};
	const onOnline = () => {
		setOffline(false);
		if (local.showReconnected !== false) {
			setReconnected(true);
			clearTimeout(timer);
			timer = setTimeout(() => setReconnected(false), 3000);
		}
	};

	onMount(() => {
		setOffline(!navigator.onLine);
		window.addEventListener("offline", onOffline);
		window.addEventListener("online", onOnline);
	});
	onCleanup(() => {
		window.removeEventListener("offline", onOffline);
		window.removeEventListener("online", onOnline);
		clearTimeout(timer);
	});

	const pos = () =>
		local.position === "bottom"
			? "bottom-[calc(1rem+env(safe-area-inset-bottom))]"
			: "top-[calc(1rem+env(safe-area-inset-top))]";
	return (
		<>
			<Show when={offline()}>
				<div
					class={`solidui-offline-indicator fixed ${pos()} left-1/2 z-toast -translate-x-1/2 rounded-full bg-destructive px-4 py-1.5 text-xs font-medium text-destructive-foreground shadow-lg ${local.class ?? ""}`.trim()}
					role="status"
					{...rest}
				>
					{local.message ?? "You are offline — changes may not sync"}
				</div>
			</Show>
			<Show when={reconnected()}>
				<div
					class={`fixed ${pos()} left-1/2 z-toast -translate-x-1/2 bg-success px-4 py-1.5 text-xs font-medium text-success-foreground  ${radiusMap[local.radius ?? "full"]} ${elevationMap[local.elevation ?? "lg"]}`}
					role="status"
				>
					{local.reconnectedMessage ?? "Back online"}
				</div>
			</Show>
		</>
	);
}
