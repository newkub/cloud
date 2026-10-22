/**
 * Shared bits for the dropdown pickers (DatePicker, DateRangePicker,
 * MonthPicker, WeekPicker): trigger heights, the small icon-button class
 * and the calendar/clear glyphs.
 */
import type { ControlSize } from "../../lib/variants";

/** Trigger heights for sm/md/lg picker inputs. */
export const pickerSizeMap: Record<ControlSize, string> = {
	sm: "h-8 px-2.5 py-0.5 text-xs",
	md: "h-9 px-3 py-1 text-sm",
	lg: "h-10 px-4 py-2 text-base",
};

/** Small square icon button inside picker triggers (clear / calendar toggle). */
export const pickerIconBtn =
	"flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50";

/** Calendar glyph used by the dropdown toggle buttons. */
export function CalendarIcon(props: { class?: string }) {
	return (
		<svg
			class={props.class ?? "h-4 w-4"}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<rect x="3" y="4" width="18" height="18" rx="2" />
			<path d="M16 2v4M8 2v4M3 10h18" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	);
}

/** × glyph used by the clear buttons. */
export function ClearIcon(props: { class?: string }) {
	return (
		<svg
			class={props.class ?? "h-3.5 w-3.5"}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	);
}
