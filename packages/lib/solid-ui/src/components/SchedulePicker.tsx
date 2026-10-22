/**
 * SchedulePicker - grid of time slots with single selection (booking pattern).
 */
import { For, type JSX, splitProps } from "solid-js";

export interface TimeSlot {
	/** Display label, e.g. "09:00". */
	label: string;
	/** Disabled slot (booked/unavailable). @default false */
	disabled?: boolean;
}

export interface SchedulePickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Available slots. */
	slots: TimeSlot[];
	/** Selected slot label. */
	value?: string;
	/** Called when a free slot is picked. */
	onSelect?: (label: string) => void;
	/** Grid columns. @default 4 */
	columns?: number;
}

export function SchedulePicker(props: SchedulePickerProps) {
	const [local, rest] = splitProps(props, ["class", "slots", "value", "onSelect", "columns"]);

	const className = () => ["solidui-schedule-picker grid gap-2", local.class ?? ""].filter(Boolean).join(" ");

	return (
		<div
			class={className()}
			role="listbox"
			aria-label="Time slots"
			style={{ "grid-template-columns": `repeat(${local.columns ?? 4}, minmax(0, 1fr))` }}
			{...rest}
		>
			<For each={local.slots}>
				{(slot) => (
					<div
						role="option"
						tabIndex={slot.disabled ? -1 : 0}
						aria-selected={local.value === slot.label}
						aria-disabled={slot.disabled}
						class={`h-9 flex items-center justify-center text-sm rounded-md border transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
							slot.disabled
								? "bg-muted text-muted-foreground border-border line-through cursor-not-allowed"
								: local.value === slot.label
									? "bg-primary text-primary-foreground border-primary"
									: "bg-background text-foreground border-input hover:bg-accent"
						}`}
						onClick={() => !slot.disabled && local.onSelect?.(slot.label)}
						onKeyDown={(e) => {
							if (!slot.disabled && (e.key === "Enter" || e.key === " ")) {
								e.preventDefault();
								local.onSelect?.(slot.label);
							}
						}}
					>
						{slot.label}
					</div>
				)}
			</For>
		</div>
	);
}
