/**
 * TimezoneGrid — strip of mini clocks: city label, local time, UTC offset and day/night icon.
 */
import { createSignal, For, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";

export interface TimezoneGridZone {
	/** City/zone label */
	label: string;
	/** Offset from UTC in hours (may be fractional, e.g. 5.5) */
	offset: number;
}

export interface TimezoneGridProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Zones to render clocks for */
	zones: TimezoneGridZone[];
	/** Hour format @default "24h" */
	format?: "12h" | "24h";
	/** Update interval in ms @default 1000 */
	interval?: number;
}

const offsetLabel = (offset: number) => `${offset >= 0 ? "+" : "−"}${Math.abs(offset)}h`;

const isDay = (hour: number) => hour >= 6 && hour < 18;

export function TimezoneGrid(props: TimezoneGridProps) {
	const [local, rest] = splitProps(props, ["class", "zones", "format", "interval"]);
	const [now, setNow] = createSignal(new Date());
	onMount(() => {
		const timer = setInterval(() => setNow(new Date()), local.interval ?? 1000);
		onCleanup(() => clearInterval(timer));
	});

	const zoned = (offset: number) => {
		const d = new Date(now().getTime() + offset * 3_600_000);
		return { hours: d.getUTCHours(), minutes: d.getUTCMinutes() };
	};
	const timeStr = (offset: number) => {
		const { hours, minutes } = zoned(offset);
		const mm = String(minutes).padStart(2, "0");
		if ((local.format ?? "24h") === "12h") {
			const h12 = hours % 12 === 0 ? 12 : hours % 12;
			return `${h12}:${mm} ${hours < 12 ? "AM" : "PM"}`;
		}
		return `${String(hours).padStart(2, "0")}:${mm}`;
	};

	return (
		// biome-ignore lint/a11y/useSemanticElements: generic clock group, not a form fieldset
		<div
			class={`solidui-timezone-grid flex flex-wrap items-stretch gap-2 ${local.class ?? ""}`.trim()}
			role="group"
			aria-label="Time zones"
			{...rest}
		>
			<For each={local.zones ?? []}>
				{(zone) => {
					const day = () => isDay(zoned(zone.offset).hours);
					return (
						<div class="flex min-w-24 flex-col items-center gap-0.5 rounded-md border border-border bg-surface px-3 py-2">
							<div class="flex items-center gap-1">
								<span class={day() ? "text-warning" : "text-info"} aria-hidden="true">
									<Show
										when={day()}
										fallback={
											<svg
												class="h-3.5 w-3.5"
												viewBox="0 0 24 24"
												fill="currentColor"
												stroke="currentColor"
												stroke-width="1"
												stroke-linejoin="round"
												aria-hidden="true"
											>
												<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
											</svg>
										}
									>
										<svg
											class="h-3.5 w-3.5"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											aria-hidden="true"
										>
											<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
											<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
										</svg>
									</Show>
								</span>
								<span class="text-2xs font-medium text-muted-foreground">{zone.label}</span>
							</div>
							<span class="font-mono text-sm font-semibold tabular-nums text-foreground">{timeStr(zone.offset)}</span>
							<span class="text-2xs tabular-nums text-muted-foreground">UTC{offsetLabel(zone.offset)}</span>
							<span class="sr-only">{day() ? "daytime" : "nighttime"}</span>
						</div>
					);
				}}
			</For>
		</div>
	);
}
