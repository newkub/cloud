import { type Accessor, For, type Setter } from "solid-js";
import { type Radius, radiusMap } from "../../lib/variants";
import { MONTH_SHORT } from "../date-helpers";

const cellSize = { sm: "h-7 text-2xs", md: "h-9 text-xs", lg: "h-10 text-sm" } as const;

const navBtn =
	"flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50";

export interface MonthGridProps {
	year: Accessor<number>;
	setYear: Setter<number>;
	cursor: Accessor<number>;
	setCursor: Setter<number>;
	value: Accessor<string>;
	monthDisabled: (month: number) => boolean;
	prevYearDisabled: Accessor<boolean>;
	nextYearDisabled: Accessor<boolean>;
	onSelect: (month: number) => void;
	/** Escape pressed inside the grid — only meaningful in dropdown mode. */
	onEscape: () => void;
	size?: "sm" | "md" | "lg";
	radius?: Radius;
	fullWidth?: boolean;
}

export function MonthGrid(props: MonthGridProps) {
	let gridRef: HTMLDivElement | undefined;

	/** Roving-focus arrow navigation across the 12 month cells, wrapping years. */
	const onGridKeyDown = (e: KeyboardEvent) => {
		const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4 };
		let next: number;
		if (e.key === "Home") next = 0;
		else if (e.key === "End") next = 11;
		else if (e.key in moves) next = props.cursor() + moves[e.key];
		else if (e.key === "Escape") {
			props.onEscape();
			return;
		} else return;
		e.preventDefault();
		let y = props.year();
		while (next < 0) {
			next += 12;
			y -= 1;
		}
		while (next > 11) {
			next -= 12;
			y += 1;
		}
		if (y !== props.year()) props.setYear(y);
		props.setCursor(next);
		queueMicrotask(() => gridRef?.querySelector<HTMLButtonElement>(`[data-month="${next}"]`)?.focus());
	};

	return (
		<>
			<div class="mb-2 flex items-center justify-between">
				<button
					type="button"
					class={navBtn}
					aria-label="Previous year"
					disabled={props.prevYearDisabled()}
					onClick={() => props.setYear((y) => y - 1)}
				>
					‹
				</button>
				<span class="text-sm font-semibold" aria-live="polite">
					{props.year()}
				</span>
				<button
					type="button"
					class={navBtn}
					aria-label="Next year"
					disabled={props.nextYearDisabled()}
					onClick={() => props.setYear((y) => y + 1)}
				>
					›
				</button>
			</div>
			<div ref={gridRef} class="grid grid-cols-4 gap-1" role="listbox" aria-label="Months" onKeyDown={onGridKeyDown}>
				<For each={MONTH_SHORT}>
					{(m, i) => {
						const val = () => `${props.year()}-${String(i() + 1).padStart(2, "0")}`;
						const active = () => props.value() === val();
						const isCurrent = () =>
							val() === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
						return (
							<button
								type="button"
								role="option"
								data-month={i()}
								aria-selected={active()}
								aria-current={isCurrent() ? "date" : undefined}
								disabled={props.monthDisabled(i())}
								tabIndex={props.cursor() === i() ? 0 : -1}
								class={` px-2 ${cellSize[props.size ?? "md"]} motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${
									active()
										? "bg-primary text-primary-foreground"
										: isCurrent()
											? "font-semibold text-primary hover:bg-muted"
											: "text-foreground hover:bg-muted"
								} ${radiusMap[props.radius ?? "md"]} ${props.fullWidth ? "w-full" : ""}`}
								onClick={() => props.onSelect(i())}
								onFocus={() => props.setCursor(i())}
							>
								{m}
							</button>
						);
					}}
				</For>
			</div>
		</>
	);
}
