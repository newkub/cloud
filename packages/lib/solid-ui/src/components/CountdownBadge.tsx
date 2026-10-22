/**
 * CountdownBadge — compact pill countdown ("2d 4h") with urgency color under 24h.
 * @deprecated Use `Countdown` with `variant="pill"`.
 */
import { type JSX, splitProps } from "solid-js";
import { Countdown } from "./Countdown";

export interface CountdownBadgeProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Target instant — Date or epoch ms */
	target: Date | number;
	/** Optional text label prepended inside the pill */
	label?: string;
	/** Text shown once the target has passed @default "Ended" */
	endedText?: string;
	/** Update interval in ms @default 1000 */
	interval?: number;
}

export function CountdownBadge(props: CountdownBadgeProps) {
	const [local, rest] = splitProps(props, ["target", "label", "endedText", "interval"]);
	return <Countdown to={local.target} variant="pill" pillLabel={local.label} endedText={local.endedText} {...rest} />;
}
