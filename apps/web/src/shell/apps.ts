export type AppTabId = "app" | "docs" | "settings" | "logs";

export interface AppTabMeta {
	id: AppTabId;
	label: string;
	icon: string;
}

export const APP_TAB_META: Record<AppTabId, AppTabMeta> = {
	app: {
		id: "app",
		label: "App",
		icon: "i-mdi:view-dashboard-outline",
	},
	docs: {
		id: "docs",
		label: "Docs",
		icon: "i-mdi:book-open-variant",
	},
	settings: {
		id: "settings",
		label: "Settings",
		icon: "i-mdi:cog-outline",
	},
	logs: {
		id: "logs",
		label: "Logs",
		icon: "i-mdi:math-log",
	},
};

export const APP_TABS: readonly AppTabMeta[] = [
	APP_TAB_META.app,
	APP_TAB_META.docs,
	APP_TAB_META.settings,
	APP_TAB_META.logs,
];

export interface AppTabItem extends AppTabMeta {
	active: boolean;
	href: string;
	onSelect: () => void;
}

/** Route where each product console lives. CI has a dedicated, deeper app. */
export function productAppPath(key: string): string {
	return key === "ci" ? "/ci" : `/products/${key}`;
}

export type AppContext =
	| { kind: "cloud" }
	| { kind: "ci" }
	| { kind: "product"; slug: string };

export function appContextForPath(pathname: string): AppContext {
	if (pathname === "/ci" || pathname.startsWith("/ci/")) {
		return { kind: "ci" };
	}
	const match = /^\/products\/([^/]+)/.exec(pathname);
	if (match?.[1]) {
		return { kind: "product", slug: match[1] };
	}
	return { kind: "cloud" };
}
