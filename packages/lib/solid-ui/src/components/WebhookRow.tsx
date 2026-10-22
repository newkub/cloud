/**
 * WebhookRow - webhook endpoint row with status, URL and last delivery info.
 */
import { type JSX, splitProps } from "solid-js";
import { StatusDot } from "./StatusDot";

export interface WebhookRowProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Endpoint URL. */
	url: string;
	/** Health status. @default "ok" */
	status?: "ok" | "failing" | "disabled";
	/** Last delivery label, e.g. "2m ago". */
	lastDelivery?: string;
	/** Subscribed events summary. */
	events?: string;
	/** Trailing actions slot. */
	actions?: JSX.Element;
}

const tone = { ok: "success", failing: "danger", disabled: "default" } as const;

export function WebhookRow(props: WebhookRowProps) {
	const [local, rest] = splitProps(props, ["class", "url", "status", "lastDelivery", "events", "actions"]);

	const className = () =>
		["solidui-webhook-row flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/50", local.class ?? ""]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<StatusDot status={tone[local.status ?? "ok"]} />
			<span class="min-w-0 flex-1">
				<span class="block truncate font-mono text-sm text-foreground">{local.url}</span>
				<span class="block text-xs text-muted-foreground">
					{local.events ?? "all events"}
					{local.lastDelivery ? ` · last ${local.lastDelivery}` : ""}
				</span>
			</span>
			{local.actions}
		</div>
	);
}
