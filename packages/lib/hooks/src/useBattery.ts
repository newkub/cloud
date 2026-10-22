import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface BatteryInfo {
	/** Charge level 0–1 */
	level: number;
	/** True while charging */
	charging: boolean;
	/** Seconds until full (Infinity when discharging) */
	chargingTime: number;
	/** Seconds until empty (Infinity while charging) */
	dischargingTime: number;
}

interface BatteryManagerLike extends EventTarget {
	level: number;
	charging: boolean;
	chargingTime: number;
	dischargingTime: number;
}

const EVENTS = ["chargingchange", "levelchange", "chargingtimechange", "dischargingtimechange"] as const;

/**
 * Battery Status API (`navigator.getBattery`) — a snapshot accessor that
 * tracks charge/level/time events. Stays `null` on browsers without the
 * API (Firefox, Safari) and on SSR — never throws.
 *
 * @returns Accessor for `BatteryInfo | null`
 *
 * @example
 * const battery = useBattery();
 * <Show when={battery()} fallback={<span>battery unavailable</span>}>
 *   {(b) => <span>{Math.round(b().level * 100)}% {b().charging ? "⚡" : ""}</span>}
 * </Show>
 */
export function useBattery(): Accessor<BatteryInfo | null> {
	const [battery, setBattery] = createSignal<BatteryInfo | null>(null);

	onMount(() => {
		const getBattery = (navigator as { getBattery?: () => Promise<BatteryManagerLike> }).getBattery;
		if (!getBattery) return;
		let disposed = false;
		let manager: BatteryManagerLike | undefined;
		const read = () => {
			const m = manager;
			if (m) {
				setBattery({
					level: m.level,
					charging: m.charging,
					chargingTime: m.chargingTime,
					dischargingTime: m.dischargingTime,
				});
			}
		};
		getBattery
			.call(navigator)
			.then((m) => {
				if (disposed) return;
				manager = m;
				read();
				for (const type of EVENTS) m.addEventListener(type, read);
			})
			.catch(() => setBattery(null));
		onCleanup(() => {
			disposed = true;
			if (manager) for (const type of EVENTS) manager.removeEventListener(type, read);
		});
	});

	return battery;
}
