import { useLocation, useNavigate } from "@tanstack/solid-router";
import { Button } from "@wrikka/solid-ui";
import type { JSX } from "solid-js";
import { AppFrame } from "./AppFrame";
import { APP_TAB_META, type AppTabId, type AppTabItem } from "./apps";

const SECTION_META: Record<AppTabId, { name: string; description: string }> = {
	app: {
		name: "Cloud",
		description:
			"Your Wrikka Cloud workspace — every service, its docs, settings and logs in one place.",
	},
	docs: {
		name: "Documentation",
		description:
			"Guides for the console, the CI pipeline and every product tab.",
	},
	settings: {
		name: "Settings",
		description: "Workspace preferences, appearance and the CI API connection.",
	},
	logs: {
		name: "Logs",
		description: "Live run output and service logs from across the workspace.",
	},
};

export function CloudFrame(props: { children: JSX.Element }) {
	const navigate = useNavigate();
	const pathname = useLocation({ select: (location) => location.pathname });

	const activeTab = (): AppTabId => {
		const path = pathname();
		if (path === "/docs") return "docs";
		if (path === "/settings") return "settings";
		if (path === "/logs") return "logs";
		return "app";
	};

	const section = () => SECTION_META[activeTab()];

	const tabs = (): AppTabItem[] => [
		{
			...APP_TAB_META.app,
			active: activeTab() === "app",
			href: "/",
			onSelect: () => navigate({ to: "/" }),
		},
		{
			...APP_TAB_META.docs,
			active: activeTab() === "docs",
			href: "/docs",
			onSelect: () => navigate({ to: "/docs" }),
		},
		{
			...APP_TAB_META.settings,
			active: activeTab() === "settings",
			href: "/settings",
			onSelect: () => navigate({ to: "/settings" }),
		},
		{
			...APP_TAB_META.logs,
			active: activeTab() === "logs",
			href: "/logs",
			onSelect: () => navigate({ to: "/logs" }),
		},
	];

	return (
		<AppFrame
			icon="i-mdi:cloud-outline"
			name={section().name}
			description={section().description}
			status="available"
			live
			tabs={tabs()}
			actions={
				<Button
					variant="secondary"
					size="sm"
					onClick={() => navigate({ to: "/products" })}
				>
					<span class="i-mdi:grid" /> All apps
				</Button>
			}
		>
			{props.children}
		</AppFrame>
	);
}
