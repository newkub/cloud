/**
 * DigitalClock — live clock display with timezone, seconds and blinking colon.
 */
import { createSignal, type JSX, onCleanup, splitProps } from "solid-js";

export interface DigitalClockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** IANA timezone — defaults to local. */
	timezone?: string;
	/** 24h format. @default true */
	hour12?: boolean;
	/** Show seconds. @default true */
	showSeconds?: boolean;
	/** Blinking colon. @default false */
	blinking?: boolean;
	/** Date line under the time. */
	showDate?: boolean;
	/** Update interval ms. @default 1000 */
	interval?: number;
	size?: "sm" | "md" | "lg";
	/** Monospace digits. @default true */
	mono?: boolean;
}

const timeSize = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" } as const;

export function DigitalClock(props: DigitalClockProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"timezone",
		"hour12",
		"showSeconds",
		"blinking",
		"showDate",
		"interval",
		"size",
		"mono",
	]);
	const [now, setNow] = createSignal(new Date());
	const timer = setInterval(() => setNow(new Date()), local.interval ?? 1000);
	onCleanup(() => clearInterval(timer));

	const parts = () => {
		const opts: Intl.DateTimeFormatOptions = {
			hour: "2-digit",
			minute: "2-digit",
			second: (local.showSeconds ?? true) ? "2-digit" : undefined,
			hour12: local.hour12 ?? false,
			timeZone: local.timezone,
		};
		return now().toLocaleTimeString("en-GB", opts);
	};
	const dateStr = () =>
		now().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: local.timezone });
	const rendered = () => (local.blinking ? parts().replace(/:/g, " ") : parts());

	return (
		<div class={`solidui-digital-clock inline-flex flex-col items-center ${local.class ?? ""}`.trim()} {...rest}>
			<span
				class={`tabular-nums leading-none text-foreground ${(local.mono ?? true) ? "font-mono" : ""} ${timeSize[local.size ?? "md"]} ${local.blinking ? "motion-safe:animate-pulse" : ""}`}
			>
				{rendered()}
			</span>
			{local.showDate && <span class="mt-1 text-2xs text-muted-foreground">{dateStr()}</span>}
		</div>
	);
}
