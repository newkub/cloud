/**
 * SsoConnectionRow - SSO connection row: provider name, verified domain chips and status pill.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { chipVariants } from "../lib/variants";

export type SsoStatus = "active" | "pending" | "error";

export interface SsoConnectionRowProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Provider display name, e.g. "Okta", "Google Workspace". */
	provider: string;
	/** Domains claimed by this connection. */
	domains: string[];
	/** Connection status. */
	status: SsoStatus;
	/** Optional link — wraps the provider name in an anchor. */
	href?: string;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const statusChip: Record<SsoStatus, string> = {
	active: chipVariants.success,
	pending: chipVariants.warning,
	error: chipVariants.destructive,
};

const statusDot: Record<SsoStatus, string> = {
	active: "bg-success",
	pending: "bg-warning",
	error: "bg-destructive",
};

export function SsoConnectionRow(props: SsoConnectionRowProps) {
	const [local, rest] = splitProps(props, ["class", "provider", "domains", "status", "href", "unstyled"]);

	const domains = () => local.domains ?? [];

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: `solidui-sso-connection-row flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent/50 ${local.class ?? ""}`.trim();

	return (
		<div class={className()} {...rest}>
			<div class="min-w-0 flex-1">
				<Show
					when={local.href}
					fallback={<span class="block truncate text-sm font-medium text-foreground">{local.provider}</span>}
				>
					<a
						href={local.href}
						class="block truncate text-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						{local.provider}
					</a>
				</Show>
				<Show when={domains().length > 0}>
					<div class="mt-1 flex flex-wrap items-center gap-1">
						<For each={domains()}>
							{(domain) => (
								<span class="inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-2xs text-muted-foreground">
									<NamedIcon name="globe" class="h-2.5 w-2.5" />
									{domain}
								</span>
							)}
						</For>
					</div>
				</Show>
			</div>
			<span
				class={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-2xs font-medium capitalize ${statusChip[local.status]}`}
			>
				<span class={`h-1.5 w-1.5 rounded-full ${statusDot[local.status]}`} aria-hidden="true" />
				{local.status}
			</span>
		</div>
	);
}
