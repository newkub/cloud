/**
 * DurationInput — days/hours/minutes segmented numeric inputs with a total-seconds summary.
 */
import { createSignal, createUniqueId, For, type JSX, splitProps } from "solid-js";

const SEGMENTS = [
	{ key: "days", label: "Days", seconds: 86400 },
	{ key: "hours", label: "Hours", seconds: 3600 },
	{ key: "minutes", label: "Minutes", seconds: 60 },
] as const;

export interface DurationInputProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "value"> {
	/** Controlled duration in total seconds. */
	value?: number;
	/** Initial duration in seconds for uncontrolled usage. @default 0 */
	defaultValue?: number;
	/** Called with the next total-seconds value on any segment edit. */
	onChange?: (seconds: number) => void;
}

export function DurationInput(props: DurationInputProps) {
	const [local, rest] = splitProps(props, ["class", "value", "defaultValue", "onChange"]);
	const id = `solidui-duration-input-${createUniqueId()}`;
	const [internal, setInternal] = createSignal(local.defaultValue ?? 0);
	const total = () => Math.max(0, Math.floor(local.value ?? internal()));

	const parts = () => {
		let rest_ = total();
		return SEGMENTS.map((seg) => {
			const amount = Math.floor(rest_ / seg.seconds);
			rest_ -= amount * seg.seconds;
			return amount;
		});
	};

	const commit = (index: number, amount: number) => {
		const next = parts();
		next[index] = Math.max(0, Math.floor(Number.isNaN(amount) ? 0 : amount));
		const seconds = next.reduce((sum, n, i) => sum + n * SEGMENTS[i].seconds, 0);
		if (local.value === undefined) setInternal(seconds);
		local.onChange?.(seconds);
	};

	const summary = () => {
		const [d, h, m] = parts();
		const bits: string[] = [];
		if (d) bits.push(`${d}d`);
		if (h) bits.push(`${h}h`);
		if (m) bits.push(`${m}m`);
		return bits.length ? bits.join(" ") : "0m";
	};

	return (
		<div class={`solidui-duration-input flex flex-col gap-2 ${local.class ?? ""}`} {...rest}>
			<div class="grid grid-cols-3 gap-2">
				<For each={SEGMENTS}>
					{(seg, i) => (
						<div class="flex flex-col gap-1">
							<label for={`${id}-${seg.key}`} class="text-xs font-medium text-muted-foreground">
								{seg.label}
							</label>
							<input
								id={`${id}-${seg.key}`}
								type="number"
								min={0}
								class="h-9 w-full rounded-md border border-input bg-background px-2 text-center text-sm tabular-nums text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								value={parts()[i()]}
								onInput={(e) => commit(i(), Number(e.currentTarget.value))}
							/>
						</div>
					)}
				</For>
			</div>
			<p class="text-xs text-muted-foreground">
				Total: <span class="font-medium tabular-nums text-foreground">{total()}s</span>
				<span aria-hidden="true"> · </span>
				{summary()}
			</p>
		</div>
	);
}
