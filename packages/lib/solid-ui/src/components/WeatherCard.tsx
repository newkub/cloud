/**
 * WeatherCard — condition icon (drawn svg), temperature, hi/lo and a humidity/wind row.
 */
import { type JSX, Show, splitProps } from "solid-js";

export type WeatherCondition = "sun" | "cloud" | "rain" | "snow";

export interface WeatherCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Weather condition — picks the drawn icon */
	condition: WeatherCondition;
	/** Current temperature */
	temp: number;
	/** Daily high */
	hi: number;
	/** Daily low */
	lo: number;
	/** Humidity percent (0–100) */
	humidity?: number;
	/** Wind speed in km/h */
	wind?: number;
	/** Location name shown above the temperature */
	location?: string;
	/** Temperature unit suffix @default "°" */
	unit?: string;
}

const iconTint: Record<WeatherCondition, string> = {
	sun: "text-warning",
	cloud: "text-muted-foreground",
	rain: "text-info",
	snow: "text-info",
};

const conditionLabel: Record<WeatherCondition, string> = {
	sun: "Sunny",
	cloud: "Cloudy",
	rain: "Rain",
	snow: "Snow",
};

const icons: Record<WeatherCondition, JSX.Element> = {
	sun: (
		<svg
			class="h-10 w-10"
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
	),
	cloud: (
		<svg
			class="h-10 w-10"
			viewBox="0 0 24 24"
			fill="currentColor"
			stroke="currentColor"
			stroke-width="1"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M17.5 19a4.5 4.5 0 0 0 .9-8.9 6 6 0 0 0-11.7 1.2A4 4 0 0 0 7 19h10.5Z" />
		</svg>
	),
	rain: (
		<svg
			class="h-10 w-10"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path
				d="M17.5 14a4.5 4.5 0 0 0 .9-8.9 6 6 0 0 0-11.7 1.2A4 4 0 0 0 7 14h10.5Z"
				fill="currentColor"
				stroke="none"
			/>
			<path d="M8 17v3M12 17v3M16 17v3" />
		</svg>
	),
	snow: (
		<svg
			class="h-10 w-10"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path
				d="M17.5 13a4.5 4.5 0 0 0 .9-8.9 6 6 0 0 0-11.7 1.2A4 4 0 0 0 7 13h10.5Z"
				fill="currentColor"
				stroke="none"
			/>
			<path d="M8 17l.01.01M12 19l.01.01M16 17l.01.01M10 15.5l.01.01M14 15.5l.01.01" />
		</svg>
	),
};

export function WeatherCard(props: WeatherCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"condition",
		"temp",
		"hi",
		"lo",
		"humidity",
		"wind",
		"location",
		"unit",
	]);
	const unit = () => local.unit ?? "°";
	return (
		<div
			class={`solidui-weather-card w-44 rounded-lg border border-border bg-surface p-4 shadow-sm ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-start justify-between gap-2">
				<div>
					<Show when={local.location}>
						<p class="text-2xs font-medium uppercase tracking-wide text-muted-foreground">{local.location}</p>
					</Show>
					<p class="mt-1 text-3xl font-bold tracking-tight tabular-nums text-foreground">
						{local.temp}
						{unit()}
					</p>
					<p class="mt-0.5 text-xs tabular-nums text-muted-foreground">
						H {local.hi}
						{unit()} · L {local.lo}
						{unit()}
					</p>
				</div>
				<span class={iconTint[local.condition]} role="img" aria-label={conditionLabel[local.condition]}>
					{icons[local.condition]}
				</span>
			</div>
			<Show when={local.humidity !== undefined || local.wind !== undefined}>
				<div class="mt-3 flex items-center gap-4 border-t border-border pt-2 text-2xs tabular-nums text-muted-foreground">
					<Show when={local.humidity !== undefined}>
						<span class="flex items-center gap-1">
							<svg class="h-3.5 w-3.5 text-info" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<path d="M12 2.7s6.5 7 6.5 11.3a6.5 6.5 0 1 1-13 0C5.5 9.7 12 2.7 12 2.7Z" />
							</svg>
							{local.humidity}%
						</span>
					</Show>
					<Show when={local.wind !== undefined}>
						<span class="flex items-center gap-1">
							<svg
								class="h-3.5 w-3.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								aria-hidden="true"
							>
								<path d="M3 8h9.5a2.5 2.5 0 1 0-2.4-3.2M3 12h13.5a2.5 2.5 0 1 1-2.4 3.2M3 16h6" />
							</svg>
							{local.wind} km/h
						</span>
					</Show>
				</div>
			</Show>
		</div>
	);
}
