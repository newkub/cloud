/**
 * InvoiceTimeline - horizontal timeline of invoice state events (draft → sent → viewed → paid/overdue).
 */

import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type SurfaceVariant, surfaceVariants } from "../lib/variants";

export type InvoiceEventState = "draft" | "sent" | "viewed" | "paid" | "overdue";

export interface InvoiceEvent {
	state: InvoiceEventState;
	/** When the event occurred — Date, ISO string or epoch ms. */
	at?: Date | string | number;
}

const EVENT_META: Record<InvoiceEventState, { icon: string; label: string; tone: string }> = {
	draft: { icon: "file", label: "Draft", tone: "border-border bg-muted text-muted-foreground" },
	sent: { icon: "send", label: "Sent", tone: "border-primary/30 bg-primary/10 text-primary" },
	viewed: { icon: "eye", label: "Viewed", tone: "border-info/30 bg-info/10 text-info" },
	paid: { icon: "check", label: "Paid", tone: "border-success/30 bg-success/10 text-success" },
	overdue: { icon: "clock", label: "Overdue", tone: "border-destructive/30 bg-destructive/10 text-destructive" },
};

export interface InvoiceTimelineProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Events in chronological order. */
	events: InvoiceEvent[];
	/** BCP 47 locale — defaults to the runtime locale. */
	locale?: string;
	variant?: SurfaceVariant;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function InvoiceTimeline(props: InvoiceTimelineProps) {
	const [local, pass] = splitProps(props, ["events", "locale"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "solidui-invoice-timeline p-4",
		variants: surfaceVariants,
		defaultVariant: "default",
	});
	const dateFmt = () => new Intl.DateTimeFormat(local.locale, { month: "short", day: "numeric" });

	return (
		<div class={className()} {...rest}>
			<Show
				when={(local.events?.length ?? 0) > 0}
				fallback={<p class="text-xs text-muted-foreground">No invoice activity yet.</p>}
			>
				<ol class="flex items-start" aria-label="Invoice timeline">
					<For each={local.events}>
						{(event, i) => {
							const meta = () => EVENT_META[event.state] ?? EVENT_META.draft;
							const isLast = () => i() === local.events.length - 1;
							return (
								<li class="flex min-w-0 flex-1 flex-col" aria-current={isLast() ? "step" : undefined}>
									<div class="flex items-center">
										<span
											class={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${meta().tone}`}
										>
											<NamedIcon name={meta().icon} class="h-3.5 w-3.5" />
										</span>
										<Show when={!isLast()}>
											<span class="h-px flex-1 bg-border" aria-hidden="true" />
										</Show>
									</div>
									<span class="mt-1.5 text-xs font-medium text-foreground">{meta().label}</span>
									<Show when={event.at !== undefined}>
										<time class="text-2xs tabular-nums text-muted-foreground">
											{dateFmt().format(new Date(event.at ?? 0))}
										</time>
									</Show>
								</li>
							);
						}}
					</For>
				</ol>
			</Show>
		</div>
	);
}
