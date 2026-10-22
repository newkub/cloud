/**
 * TimeField — segmented HH:MM(:SS) time input with arrows, typing, auto-advance
 * and an optional 12-hour AM/PM segment.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type Accessor, createEffect, createMemo, createSignal, Show } from "solid-js";

export interface TimeFieldProps {
	/** Controlled time — accepts a Date (or accessor); undefined clears. */
	value?: Date | undefined | Accessor<Date | undefined>;
	/** Initial time. */
	defaultValue?: Date;
	/** Called with the updated Date (same calendar day as the current value). */
	onChange?: (date: Date | undefined) => void;
	/** 12 shows hour 1–12 + AM/PM segment, 24 shows 0–23. @default 24 */
	hourCycle?: 12 | 24;
	/** Show a seconds segment. @default false */
	showSeconds?: boolean;
	/** Arrow step for the minute segment. @default 1 */
	minuteStep?: number;
	/** Disable all segments. */
	disabled?: boolean;
	/** Form field name applied to each segment input. */
	name?: string;
	class?: string;
}

interface Parts {
	h: number;
	m: number;
	s: number;
	pm: boolean;
}

const pad2 = (n: number) => String(n).padStart(2, "0");
const wrap = (n: number, max: number) => ((n % max) + max) % max;

function partsFrom(d: Date | undefined, cycle: 12 | 24): Parts {
	if (!d) return { h: cycle === 12 ? 12 : 0, m: 0, s: 0, pm: false };
	let h = d.getHours();
	const pm = h >= 12;
	if (cycle === 12) h = h % 12 === 0 ? 12 : h % 12;
	return { h, m: d.getMinutes(), s: d.getSeconds(), pm };
}

function dateFromParts(p: Parts, cycle: 12 | 24, base: Date | undefined): Date {
	const d = base ?? new Date();
	const h24 = cycle === 12 ? (p.h % 12) + (p.pm ? 12 : 0) : p.h;
	return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h24, p.m, p.s);
}

export function TimeField(props: TimeFieldProps) {
	const { className } = useComponentClasses(props, {
		base: "solidui-time-field inline-flex items-center gap-0.5 rounded-md border border-input bg-background px-2 py-1 font-mono text-sm text-foreground shadow-sm",
	});
	const cycle = () => props.hourCycle ?? 24;
	const resolveValue = (): Date | undefined => (typeof props.value === "function" ? props.value() : props.value);
	const [internalDate, setInternalDate] = createSignal<Date | undefined>(resolveValue() ?? props.defaultValue);
	const currentDate = () => resolveValue() ?? internalDate();
	const [parts, setParts] = createSignal<Parts>(partsFrom(currentDate(), cycle()));

	createEffect(() => {
		const v = resolveValue();
		if (v) setParts(partsFrom(v, cycle()));
	});

	const emit = (next: Parts) => {
		setParts(next);
		const d = dateFromParts(next, cycle(), currentDate());
		setInternalDate(d);
		props.onChange?.(d);
	};

	const nudge = (seg: string, dir: number, big: boolean) => {
		const p = { ...parts() };
		if (seg === "h") {
			if (cycle() === 12) p.h = wrap(p.h - 1 + dir * (big ? 6 : 1), 12) + 1;
			else p.h = wrap(p.h + dir * (big ? 12 : 1), 24);
		} else if (seg === "m") p.m = wrap(p.m + dir * (big ? 15 : (props.minuteStep ?? 1)), 60);
		else if (seg === "s") p.s = wrap(p.s + dir * (big ? 30 : 1), 60);
		else if (seg === "ap") p.pm = !p.pm;
		emit(p);
	};

	const display = createMemo(() => {
		const p = parts();
		return { h: pad2(p.h), m: pad2(p.m), s: pad2(p.s) };
	});

	const refs: Record<string, HTMLInputElement | undefined> = {};
	let apRef: HTMLButtonElement | undefined;
	const segOrder = () =>
		cycle() === 12
			? [...(props.showSeconds ? ["h", "m", "s"] : ["h", "m"]), "ap"]
			: props.showSeconds
				? ["h", "m", "s"]
				: ["h", "m"];

	const focusNext = (seg: string) => {
		const list = segOrder();
		const next = list[list.indexOf(seg) + 1];
		if (next === "ap") apRef?.focus();
		else refs[next]?.focus();
	};

	const onDigit = (seg: "h" | "m" | "s", ch: string, e: KeyboardEvent) => {
		e.preventDefault();
		const p = { ...parts() };
		const max = seg === "h" ? (cycle() === 12 ? 12 : 23) : 59;
		const cur = p[seg];
		const nextVal = cur * 10 + Number(ch);
		p[seg] = nextVal > max ? Number(ch) : nextVal;
		emit(p);
		const lead = Math.floor(max / 10);
		if (Number(ch) > lead || String(nextVal).length >= 2) focusNext(seg);
	};

	const Segment = (sp: { seg: "h" | "m" | "s"; text: string; label: string; max: number }) => (
		<input
			ref={(el) => (refs[sp.seg] = el)}
			type="text"
			inputMode="numeric"
			class="w-8 rounded bg-transparent text-center tabular-nums text-foreground outline-none focus:bg-accent focus:select-all disabled:opacity-50"
			aria-label={sp.label}
			role="spinbutton"
			aria-valuemin={0}
			aria-valuemax={sp.max}
			aria-valuenow={parts()[sp.seg]}
			value={sp.text}
			disabled={props.disabled}
			name={props.name}
			size={2}
			onFocus={(e) => e.currentTarget.select()}
			onKeyDown={(e) => {
				if (props.disabled) return;
				if (e.key === "ArrowUp") nudge(sp.seg, 1, e.shiftKey);
				else if (e.key === "ArrowDown") nudge(sp.seg, -1, e.shiftKey);
				else if (/^\d$/.test(e.key)) onDigit(sp.seg, e.key, e);
				else return;
				e.preventDefault();
			}}
		/>
	);

	return (
		// biome-ignore lint/a11y/useSemanticElements: segmented time editor, not a form fieldset
		<div class={`${className()} ${props.class ?? ""}`.trim()} role="group" aria-label="Time">
			<Segment
				seg="h"
				label={cycle() === 12 ? "Hours (12-hour)" : "Hours"}
				text={display().h}
				max={cycle() === 12 ? 12 : 23}
			/>
			<span aria-hidden="true" class="text-muted-foreground">
				:
			</span>
			<Segment seg="m" label="Minutes" text={display().m} max={59} />
			<Show when={props.showSeconds}>
				<span aria-hidden="true" class="text-muted-foreground">
					:
				</span>
				<Segment seg="s" label="Seconds" text={display().s} max={59} />
			</Show>
			<Show when={cycle() === 12}>
				<button
					ref={(el) => (apRef = el)}
					type="button"
					disabled={props.disabled}
					aria-pressed={parts().pm}
					aria-label={parts().pm ? "PM — switch to AM" : "AM — switch to PM"}
					class="ml-1 rounded px-1 text-xs text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
					onClick={() => nudge("ap", 1, false)}
				>
					{parts().pm ? "PM" : "AM"}
				</button>
			</Show>
		</div>
	);
}
