/**
 * CiBadge — CI build shield: a muted label segment joined to a colored
 * status pill, optionally wrapped in a link.
 */
import { type JSX, Show, splitProps } from "solid-js";

export type CiStatus = "passing" | "failing" | "pending" | "skipped" | "cancelled" | "unknown" | (string & {});

export interface CiBadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Build status — picks the right segment color */
	status: CiStatus;
	/** Left segment text. @default "build" */
	label?: string;
	/** Wrap the shield in an anchor pointing here. */
	href?: string;
}

const statusCls = (status: string) =>
	(
		({
			passing: "bg-success/15 text-success",
			failing: "bg-destructive/15 text-destructive",
			pending: "bg-warning/15 text-warning",
			skipped: "bg-info/15 text-info",
			cancelled: "bg-muted text-muted-foreground",
		}) as Record<string, string>
	)[status] ?? "bg-muted text-muted-foreground";

export function CiBadge(props: CiBadgeProps) {
	const [local, rest] = splitProps(props, ["class", "status", "label", "href"]);
	const inner = (
		<>
			<span class="bg-muted px-2 py-0.5 text-muted-foreground">{local.label ?? "build"}</span>
			<span class={`px-2 py-0.5 font-semibold capitalize ${statusCls(local.status)}`}>{local.status}</span>
		</>
	);
	const cls = () =>
		`solidui-ci-badge inline-flex items-stretch overflow-hidden rounded-md border border-border font-mono text-2xs ${local.class ?? ""}`.trim();
	return (
		<Show
			when={local.href}
			fallback={
				<span class={cls()} {...rest}>
					{inner}
				</span>
			}
		>
			{(h) => (
				<a
					class={`${cls()} no-underline`}
					href={h()}
					target="_blank"
					rel="noreferrer"
					aria-label={`${local.label ?? "build"}: ${local.status}`}
					{...(rest as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
				>
					{inner}
				</a>
			)}
		</Show>
	);
}
