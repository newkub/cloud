import {
	createFileRoute,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/solid-router";
import { Button, Tabs, TabsList, TabsTrigger } from "@wrikka/solid-ui";
import { For, Show } from "solid-js";
import { queryClient } from "../ci/api";
import { AppFrame } from "../shell/AppFrame";
import { APP_TAB_META, type AppTabId, type AppTabItem } from "../shell/apps";

const INNER_TABS = [
	{ value: "overview", label: "Overview" },
	{ value: "runs", label: "Runs" },
	{ value: "heals", label: "Heal attempts" },
] as const;

export const Route = createFileRoute("/ci")({ component: CiLayout });

function CiLayout() {
	const pathname = useLocation({ select: (location) => location.pathname });
	const navigate = useNavigate();

	const activeTab = (): AppTabId => {
		const path = pathname();
		if (path === "/ci/docs") return "docs";
		if (path === "/ci/settings") return "settings";
		if (path === "/ci/logs") return "logs";
		return "app";
	};

	const tabs = (): AppTabItem[] => [
		{
			...APP_TAB_META.app,
			active: activeTab() === "app",
			href: "/ci",
			onSelect: () => navigate({ to: "/ci" }),
		},
		{
			...APP_TAB_META.docs,
			active: activeTab() === "docs",
			href: "/ci/docs",
			onSelect: () => navigate({ to: "/ci/docs" }),
		},
		{
			...APP_TAB_META.settings,
			active: activeTab() === "settings",
			href: "/ci/settings",
			onSelect: () => navigate({ to: "/ci/settings" }),
		},
		{
			...APP_TAB_META.logs,
			active: activeTab() === "logs",
			href: "/ci/logs",
			onSelect: () => navigate({ to: "/ci/logs" }),
		},
	];

	const innerActive = () => {
		const path = pathname();
		if (path.startsWith("/ci/runs")) return "runs";
		if (path.startsWith("/ci/heals")) return "heals";
		return "overview";
	};

	const showInner = () => {
		const path = pathname();
		return path === "/ci" || path === "/ci/runs" || path === "/ci/heals";
	};

	return (
		<AppFrame
			icon="i-mdi:pipe"
			name="CI pipeline"
			description="Self-healing continuous integration — every push is built, tested and repaired when it breaks."
			status="available"
			live
			tabs={tabs()}
			actions={
				<div class="flex flex-wrap gap-2">
					<Button
						variant="secondary"
						size="sm"
						onClick={() => void queryClient.invalidateQueries()}
					>
						<span class="i-mdi:refresh" /> Refresh
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate({ to: "/products" })}
					>
						<span class="i-mdi:grid" /> All apps
					</Button>
				</div>
			}
		>
			<Show when={showInner()}>
				<Tabs
					value={innerActive()}
					onValueChange={(value) => {
						if (value === "runs") navigate({ to: "/ci/runs" });
						else if (value === "heals") navigate({ to: "/ci/heals" });
						else navigate({ to: "/ci" });
					}}
					class="mb-6"
				>
					<TabsList variant="underline">
						<For each={INNER_TABS}>
							{(tab) => (
								<TabsTrigger value={tab.value}>{tab.label}</TabsTrigger>
							)}
						</For>
					</TabsList>
				</Tabs>
			</Show>
			<Outlet />
		</AppFrame>
	);
}
