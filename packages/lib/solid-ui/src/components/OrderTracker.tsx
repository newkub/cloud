/**
 * OrderTracker — vertical shipment timeline: ordered → shipped → out for delivery → delivered.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap, surfaceVariants } from "../lib/variants";

export interface TrackingEvent {
	/** Event label, e.g. "Shipped". */
	label: string;
	/** Timestamp — string shown as-is, number/Date formatted. */
	ts?: string | number | Date;
	/** Completed event. @default false */
	done?: boolean;
	/** Small detail line under the label, e.g. "Denver, CO". */
	note?: string;
}

export interface OrderTrackerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Timeline events, oldest first. */
	events: TrackingEvent[];
	/** Carrier name shown in the header line, e.g. "UPS". */
	carrier?: string;
	/** Tracking number shown next to the carrier. */
	trackingNumber?: string;
	/** Heading. @default "Tracking" */
	title?: string;
	/** Corner radius. */
	radius?: Radius;
}

function fmtTs(ts: string | number | Date): string {
	if (typeof ts === "string") return ts;
	return new Date(ts).toLocaleString(undefined, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

export function OrderTracker(props: OrderTrackerProps) {
	const [local, rest] = splitProps(props, ["class", "events", "carrier", "trackingNumber", "title", "radius"]);
	const lastDone = () => {
		let idx = -1;
		local.events.forEach((e, i) => {
			if (e.done) idx = i;
		});
		return idx;
	};

	const check = (
		<svg
			class="h-2.5 w-2.5"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);

	return (
		<div
			class={`solidui-order-tracker w-full max-w-sm border p-4 ${surfaceVariants.default} ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="mb-3 flex items-center justify-between gap-2">
				<h3 class="text-sm font-semibold text-foreground">{local.title ?? "Tracking"}</h3>
				<Show when={local.carrier || local.trackingNumber}>
					<p class="truncate text-2xs text-muted-foreground">
						{local.carrier}
						<Show when={local.trackingNumber}>
							<span class="font-mono"> · {local.trackingNumber}</span>
						</Show>
					</p>
				</Show>
			</div>
			<ol class="relative flex flex-col gap-4">
				<For each={local.events}>
					{(event, i) => {
						const active = () => i() === lastDone();
						const last = () => i() === local.events.length - 1;
						return (
							<li class="relative flex gap-3">
								<Show when={!last()}>
									<span
										aria-hidden="true"
										class={`absolute left-[7px] top-5 h-[calc(100%-0.5rem)] w-0.5 ${event.done ? "bg-primary" : "bg-border"}`}
									/>
								</Show>
								<span
									class={`z-[1] mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
										event.done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface"
									}`}
								>
									<Show when={event.done}>{check}</Show>
								</span>
								<div class="min-w-0 flex-1">
									<div class="flex items-baseline justify-between gap-2">
										<span
											class={`text-sm font-medium ${event.done || active() ? "text-foreground" : "text-muted-foreground"}`}
											aria-current={active() ? "step" : undefined}
										>
											{event.label}
										</span>
										<Show when={event.ts !== undefined}>
											<time class="shrink-0 text-2xs tabular-nums text-muted-foreground">
												{fmtTs(event.ts as string | number | Date)}
											</time>
										</Show>
									</div>
									<Show when={event.note}>
										<p class="mt-0.5 text-2xs text-muted-foreground">{event.note}</p>
									</Show>
								</div>
							</li>
						);
					}}
				</For>
			</ol>
		</div>
	);
}
