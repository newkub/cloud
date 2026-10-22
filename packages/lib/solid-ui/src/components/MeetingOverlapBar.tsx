/**
 * MeetingOverlapBar - per-member availability strips plus a shared-overlap strip where everyone is free.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface MeetingWindow {
	/** Window start — minutes from midnight or any consistent unit. */
	start: number;
	/** Window end — same unit as start. */
	end: number;
}

export interface MeetingMember {
	/** Member name shown as row label. */
	name: string;
	/** Busy/available windows to display. */
	windows: MeetingWindow[];
}

export interface MeetingOverlapBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Members and their windows. */
	members?: MeetingMember[];
	/** Display range — defaults to the min/max of all windows. */
	range?: MeetingWindow;
	/** Unit label used in aria descriptions, e.g. "min". */
	unit?: string;
	/** Caption for the shared-overlap strip. @default "Overlap" */
	overlapLabel?: string;
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Intersect two window lists — returns windows covered by both. */
function intersect(a: MeetingWindow[], b: MeetingWindow[]): MeetingWindow[] {
	const out: MeetingWindow[] = [];
	for (const wa of a) {
		for (const wb of b) {
			const start = Math.max(wa.start, wb.start);
			const end = Math.min(wa.end, wb.end);
			if (end > start) out.push({ start, end });
		}
	}
	return out;
}

export function MeetingOverlapBar(props: MeetingOverlapBarProps) {
	const { className, rest: others } = useComponentClasses(props, {
		base: "solidui-meeting-overlap-bar flex flex-col gap-2 border p-4",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [local, rest] = splitProps(others, ["members", "range", "unit", "overlapLabel"]);

	const members = () => local.members ?? [];
	const range = () => {
		if (local.range) return local.range;
		const starts = members().flatMap((m) => m.windows.map((w) => w.start));
		const ends = members().flatMap((m) => m.windows.map((w) => w.end));
		const start = starts.length ? Math.min(...starts) : 0;
		const end = ends.length ? Math.max(...ends) : 24 * 60;
		return { start, end: end > start ? end : start + 1 };
	};
	const pct = (v: number) => {
		const r = range();
		return clamp(((v - r.start) / (r.end - r.start)) * 100, 0, 100);
	};
	const shared = () => {
		if (members().length === 0) return [];
		return members()
			.map((m) => m.windows)
			.reduce((acc, windows) => intersect(acc, windows));
	};
	const fmt = (w: MeetingWindow) => `${w.start}–${w.end}${local.unit ? ` ${local.unit}` : ""}`;

	return (
		<div class={className()} {...rest}>
			<For each={members()}>
				{(member) => (
					<div class="flex items-center gap-3">
						<span class="w-20 shrink-0 truncate text-xs font-medium text-foreground">{member.name}</span>
						<div
							role="img"
							aria-label={`${member.name} availability`}
							class="relative h-4 min-w-0 flex-1 overflow-hidden rounded bg-muted"
						>
							<For each={member.windows}>
								{(w) => (
									<span
										aria-hidden="true"
										class="absolute inset-y-0 rounded-sm bg-primary/40"
										style={{ left: `${pct(w.start)}%`, width: `${Math.max(0, pct(w.end) - pct(w.start))}%` }}
									/>
								)}
							</For>
						</div>
					</div>
				)}
			</For>
			<Show when={members().length > 0}>
				<div class="flex items-center gap-3">
					<span class="w-20 shrink-0 text-xs font-medium text-muted-foreground">{local.overlapLabel ?? "Overlap"}</span>
					<div
						role="img"
						aria-label="Shared availability"
						class="relative h-4 min-w-0 flex-1 overflow-hidden rounded bg-muted"
					>
						<For each={shared()}>
							{(w) => (
								<span
									aria-hidden="true"
									title={fmt(w)}
									class="absolute inset-y-0 rounded-sm bg-success"
									style={{ left: `${pct(w.start)}%`, width: `${Math.max(0, pct(w.end) - pct(w.start))}%` }}
								/>
							)}
						</For>
					</div>
					<Show when={shared().length === 0}>
						<span class="sr-only">No shared availability</span>
					</Show>
				</div>
			</Show>
		</div>
	);
}
