/**
 * CloudConsoleTemplate — starter cloud console: shell with section nav over analytics, API keys and billing.
 */
import { createSignal, For, Show, type JSX } from "solid-js";
import { AppShell } from "../components/AppShell";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Sidebar } from "../components/Sidebar";
import { ApiKeysBlock, type ApiKeysBlockProps } from "../blocks/ApiKeysBlock";
import { BillingOverviewBlock, type BillingOverviewBlockProps } from "../blocks/BillingOverviewBlock";
import { MetricsDashboardBlock, type DashboardMetric, type DashboardSeries, type TopRow } from "../blocks/MetricsDashboardBlock";

export type CloudConsoleSection = "overview" | "api-keys" | "billing";

const sections: { id: CloudConsoleSection; label: string }[] = [
	{ id: "overview", label: "Overview" },
	{ id: "api-keys", label: "API keys" },
	{ id: "billing", label: "Billing" },
];

export interface CloudConsoleTemplateProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Product or workspace name in the header. @default "Console" */
	workspaceName?: string;
	/** Signed-in user shown in the sidebar footer. */
	userName?: string;
	/** Controlled active section. */
	activeSection?: CloudConsoleSection;
	/** Called when the section nav changes. */
	onSectionChange?: (section: CloudConsoleSection) => void;
	metrics?: DashboardMetric[];
	series?: DashboardSeries[];
	topPages?: TopRow[];
	topSources?: TopRow[];
	/** API key screen data. */
	apiKeys?: ApiKeysBlockProps["keys"];
	onCreateApiKey?: ApiKeysBlockProps["onCreate"];
	onRevokeApiKey?: ApiKeysBlockProps["onRevoke"];
	/** Billing screen data — omitted renders a placeholder. */
	billing?: Omit<BillingOverviewBlockProps, "class">;
}

export function CloudConsoleTemplate(props: CloudConsoleTemplateProps) {
	const [internal, setInternal] = createSignal<CloudConsoleSection>("overview");
	const active = () => props.activeSection ?? internal();
	const initials = () =>
		(props.userName ?? "")
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? "")
			.join("");

	const select = (section: CloudConsoleSection) => {
		setInternal(section);
		props.onSectionChange?.(section);
	};

	const sidebar = (
		<Sidebar
			header={
				<div class="flex items-center gap-2 px-1">
					<span class="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
						{(props.workspaceName ?? "Console").slice(0, 1).toUpperCase()}
					</span>
					<span class="truncate text-sm font-semibold text-foreground">
						{props.workspaceName ?? "Console"}
					</span>
				</div>
			}
			footer={
				<Show when={props.userName}>
					<div class="flex items-center gap-2">
						<span class="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-2xs font-medium text-muted-foreground">
							{initials()}
						</span>
						<span class="truncate text-xs text-muted-foreground">{props.userName}</span>
					</div>
				</Show>
			}
		>
			<nav aria-label="Console sections" class="flex flex-col gap-1">
				<For each={sections}>
					{(section) => (
						<Button
							type="button"
							variant={section.id === active() ? "secondary" : "ghost"}
							size="sm"
							class="w-full justify-start"
							aria-current={section.id === active() ? "page" : undefined}
							onClick={() => select(section.id)}
						>
							{section.label}
						</Button>
					)}
				</For>
			</nav>
		</Sidebar>
	);

	return (
		<div class={props.class}>
			<AppShell
				sidebar={sidebar}
				header={
					<div class="flex items-center justify-between gap-3">
						<div>
							<p class="text-2xs font-medium uppercase tracking-wide text-muted-foreground">
								{props.workspaceName ?? "Console"}
							</p>
							<h1 class="text-sm font-semibold text-foreground">
								{sections.find((section) => section.id === active())?.label}
							</h1>
						</div>
						<Badge variant="success">All systems operational</Badge>
					</div>
				}
			>
				<div class="p-4 lg:p-6">
					<Show when={active() === "overview"}>
						<MetricsDashboardBlock
							metrics={props.metrics ?? []}
							series={props.series ?? []}
							topPages={props.topPages}
							topSources={props.topSources}
						/>
					</Show>

					<Show when={active() === "api-keys"}>
						<ApiKeysBlock
							keys={props.apiKeys}
							onCreate={props.onCreateApiKey}
							onRevoke={props.onRevokeApiKey}
						/>
					</Show>

					<Show when={active() === "billing"}>
						<Show
							when={props.billing}
							fallback={
								<p class="text-sm text-muted-foreground">
									Connect a billing source to show the plan, usage and invoices here.
								</p>
							}
						>
							{(billing) => <BillingOverviewBlock {...billing()} />}
						</Show>
					</Show>
				</div>
			</AppShell>
		</div>
	);
}
