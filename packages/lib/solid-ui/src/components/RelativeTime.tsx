/**
 * RelativeTime — human "x minutes ago" timestamp with optional live updates.
 */
import { createSignal, type JSX, onCleanup, onMount, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
	["year", 31_536_000],
	["month", 2_592_000],
	["week", 604_800],
	["day", 86_400],
	["hour", 3_600],
	["minute", 60],
	["second", 1],
];

export interface RelativeTimeProps extends JSX.TimeHTMLAttributes<HTMLTimeElement> {
	/** Timestamp — Date, ISO string, or epoch ms */
	date: Date | string | number;
	/** Update interval in seconds — 0 disables live updates @default 30 */
	updateInterval?: number;
	/** Intl locale @default browser locale */
	locale?: string;
	/** Intl numeric style @default "auto" ("yesterday" vs "1 day ago") */
	numeric?: "always" | "auto";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function RelativeTime(props: RelativeTimeProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"date",
		"updateInterval",
		"locale",
		"numeric",
		"title",
		"radius",
		"elevation",
	]);
	const [, setTick] = createSignal(0);

	const ms = () => new Date(local.date).getTime();
	const text = () => {
		const t = ms();
		if (Number.isNaN(t)) return "";
		const diff = (t - Date.now()) / 1000;
		const rtf = new Intl.RelativeTimeFormat(local.locale, { numeric: local.numeric ?? "auto" });
		for (const [unit, secs] of UNITS) {
			if (Math.abs(diff) >= secs || unit === "second") {
				return rtf.format(Math.round(diff / secs), unit);
			}
		}
		return "";
	};
	const iso = () => (Number.isNaN(ms()) ? undefined : new Date(ms()).toISOString());

	onMount(() => {
		const secs = local.updateInterval ?? 30;
		if (secs > 0) {
			const id = setInterval(() => setTick((t) => t + 1), secs * 1000);
			onCleanup(() => clearInterval(id));
		}
	});

	return (
		<time
			class={`solidui-relative-time ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			datetime={iso()}
			title={local.title ?? iso()}
			{...rest}
		>
			{text()}
		</time>
	);
}
