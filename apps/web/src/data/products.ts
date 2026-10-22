export type ProductStatus = "available" | "coming-soon";

export interface ProductGroup {
	key: string;
	label: string;
}

export interface Product {
	/** URL slug — also the route param for /products/$slug */
	key: string;
	name: string;
	description: string;
	/** Iconify mdi class, e.g. `i-mdi:bell-outline` */
	icon: string;
	status: ProductStatus;
	group: string;
}

export interface ProductMetric {
	label: string;
	value: string;
	/** Short trend note, e.g. `+9%` — shown under the value */
	delta?: string;
	/** true = accent/positive trend, false = err/negative trend */
	up?: boolean;
}

export interface ProductAction {
	label: string;
	/** Iconify mdi class — safelisted via uno.config.ts */
	icon: string;
	href: string;
	/** Rendered as the primary accented action */
	primary?: boolean;
	/** Inert action (coming-soon products) */
	disabled?: boolean;
}

export interface ActivityItem {
	/** Iconify mdi class — safelisted via uno.config.ts */
	icon: string;
	text: string;
	time: string;
}

/** Complete right-side panel data for a product page. */
export interface ProductDetail {
	overview: string;
	metrics: ProductMetric[];
	actions: ProductAction[];
	activity: ActivityItem[];
}

export const isAvailable = (product: Product): boolean =>
	product.status === "available";

export const getProduct = (key: string): Product | undefined =>
	products.find((p) => p.key === key);

export const productGroups: ProductGroup[] = [
	{ key: "featured", label: "Featured" },
	{ key: "compute", label: "Compute" },
	{ key: "data", label: "Data & Storage" },
	{ key: "network", label: "Network & Edge" },
	{ key: "insights", label: "AI & Insights" },
	{ key: "delivery", label: "Delivery" },
	{ key: "platform", label: "Platform" },
];

export const products: Product[] = [
	{
		key: "notification",
		name: "Notification",
		description: "Multi-channel notification infrastructure inspired by Novu.",
		icon: "i-mdi:bell-outline",
		status: "available",
		group: "featured",
	},
	{
		key: "compute",
		name: "Compute",
		description: "Serverless functions, containers and virtual machines.",
		icon: "i-mdi:server",
		status: "coming-soon",
		group: "compute",
	},
	{
		key: "agents",
		name: "Agents",
		description: "Sandbox, MCP, skills and subagents infrastructure.",
		icon: "i-mdi:robot-outline",
		status: "coming-soon",
		group: "compute",
	},
	{
		key: "workflows",
		name: "Workflows",
		description: "Event-driven workflow orchestration.",
		icon: "i-mdi:workflow",
		status: "coming-soon",
		group: "compute",
	},
	{
		key: "storage",
		name: "Storage",
		description: "Object and block storage for cloud workloads.",
		icon: "i-mdi:harddisk",
		status: "coming-soon",
		group: "data",
	},
	{
		key: "database",
		name: "Database",
		description: "Managed SQL and NoSQL databases.",
		icon: "i-mdi:database-outline",
		status: "coming-soon",
		group: "data",
	},
	{
		key: "env",
		name: "Env",
		description: "Environment variables and secrets management.",
		icon: "i-mdi:tune",
		status: "coming-soon",
		group: "data",
	},
	{
		key: "domain",
		name: "Domain",
		description: "Register and manage custom domains.",
		icon: "i-mdi:earth",
		status: "coming-soon",
		group: "network",
	},
	{
		key: "cdn",
		name: "CDN",
		description: "Global content delivery network.",
		icon: "i-mdi:access-point-network",
		status: "coming-soon",
		group: "network",
	},
	{
		key: "network",
		name: "Network",
		description: "VPC, load balancers and private networking.",
		icon: "i-mdi:lan",
		status: "coming-soon",
		group: "network",
	},
	{
		key: "api",
		name: "API",
		description: "API gateway and management.",
		icon: "i-mdi:code-braces",
		status: "coming-soon",
		group: "network",
	},
	{
		key: "security",
		name: "Security",
		description: "Threat detection and compliance.",
		icon: "i-mdi:shield-check-outline",
		status: "coming-soon",
		group: "network",
	},
	{
		key: "ai-models",
		name: "AI Models",
		description: "Managed inference for popular AI models.",
		icon: "i-mdi:brain",
		status: "coming-soon",
		group: "insights",
	},
	{
		key: "analytics",
		name: "Analytics",
		description: "Product and usage analytics.",
		icon: "i-mdi:chart-line",
		status: "coming-soon",
		group: "insights",
	},
	{
		key: "observability",
		name: "Observability",
		description: "Metrics, traces and dashboards.",
		icon: "i-mdi:eye-outline",
		status: "coming-soon",
		group: "insights",
	},
	{
		key: "trace",
		name: "Trace",
		description: "Distributed tracing and profiling.",
		icon: "i-mdi:chart-timeline-variant",
		status: "coming-soon",
		group: "insights",
	},
	{
		key: "logs",
		name: "Logs",
		description: "Centralized log aggregation and search.",
		icon: "i-mdi:file-document-outline",
		status: "coming-soon",
		group: "insights",
	},
	{
		key: "website",
		name: "Website",
		description: "Deploy static sites and full-stack frameworks.",
		icon: "i-mdi:web",
		status: "coming-soon",
		group: "delivery",
	},
	{
		key: "media",
		name: "Media",
		description: "Image, video and audio processing.",
		icon: "i-mdi:play-box-outline",
		status: "coming-soon",
		group: "delivery",
	},
	{
		key: "auth",
		name: "Auth",
		description: "Authentication and authorization platform.",
		icon: "i-mdi:shield-key-outline",
		status: "coming-soon",
		group: "platform",
	},
	{
		key: "integrations",
		name: "Integrations",
		description: "Third-party service connectors.",
		icon: "i-mdi:puzzle-outline",
		status: "coming-soon",
		group: "platform",
	},
];

/* ---------- Product detail panels ---------- */

/** Deterministic seed so each product gets distinct (but stable) mock numbers. */
function seed(key: string): number {
	let h = 0;
	for (const ch of key) {
		h = (h * 31 + ch.charCodeAt(0)) % 997;
	}
	return h;
}

const groupLabel = (key: string): string =>
	productGroups.find((g) => g.key === key)?.label ?? "Platform";

function defaultOverview(product: Product): string {
	return `${product.description} Part of the Wrikka Cloud ${groupLabel(product.group)} line-up. ${product.name} is in active development — the panel below previews the metrics, actions and activity feed that ship with its console.`;
}

function defaultMetrics(product: Product): ProductMetric[] {
	const s = seed(product.key);
	return [
		{
			label: "Requests (24h)",
			value: `${(s % 80) + 12}.${s % 10}k`,
			delta: `+${(s % 18) + 4}%`,
			up: true,
		},
		{
			label: "Avg latency",
			value: `${(s % 60) + 24}ms`,
			delta: `-${(s % 8) + 2}%`,
			up: true,
		},
		{
			label: "Error rate",
			value: `0.0${(s % 8) + 1}%`,
			delta: "-0.01%",
			up: true,
		},
		{ label: "Active regions", value: `${(s % 5) + 3}` },
	];
}

const PREVIEW_ACTIONS: ProductAction[] = [
	{
		label: "Open dashboard",
		icon: "i-mdi:view-dashboard-outline",
		href: "#",
		primary: true,
		disabled: true,
	},
	{
		label: "Documentation",
		icon: "i-mdi:book-open-outline",
		href: "#",
		disabled: true,
	},
	{ label: "Settings", icon: "i-mdi:cog-outline", href: "#", disabled: true },
];

const PREVIEW_ACTIVITY: ActivityItem[] = [
	{
		icon: "i-mdi:source-branch",
		text: "Roadmap milestone updated — public preview scheduled",
		time: "2d ago",
	},
	{
		icon: "i-mdi:palette-outline",
		text: "Console designs approved by product review",
		time: "1w ago",
	},
	{
		icon: "i-mdi:flask-outline",
		text: "Internal alpha build passed smoke tests",
		time: "2w ago",
	},
];

const detailOverrides: Record<string, ProductDetail> = {
	notification: {
		overview:
			"Notification is Wrikka Cloud's multi-channel notification infrastructure — in-app, email, SMS and push delivery behind a single API. It ships with subscriber management, a trigger endpoint and an MCP adapter for agent workflows, plus its own dashboard and REST API out of the box.",
		metrics: [
			{ label: "Events sent (24h)", value: "12.4k", delta: "+9%", up: true },
			{
				label: "Delivery rate",
				value: "99.98%",
				delta: "+0.02%",
				up: true,
			},
			{ label: "Subscribers", value: "1,842", delta: "+31", up: true },
			{ label: "P95 latency", value: "82ms", delta: "-6ms", up: true },
		],
		actions: [
			{
				label: "Open dashboard",
				icon: "i-mdi:view-dashboard-outline",
				href: "http://localhost:3000",
				primary: true,
			},
			{
				label: "Health check",
				icon: "i-mdi:heart-pulse",
				href: "http://localhost:3000/health",
			},
			{
				label: "API explorer",
				icon: "i-mdi:api",
				href: "http://localhost:3000/api/notifications",
			},
		],
		activity: [
			{
				icon: "i-mdi:bell-ring-outline",
				text: "“welcome-email” triggered for subscriber sub_01J…",
				time: "4m ago",
			},
			{
				icon: "i-mdi:api",
				text: "POST /api/notifications — 201 Created",
				time: "12m ago",
			},
			{
				icon: "i-mdi:account-plus-outline",
				text: "New subscriber registered (email + push)",
				time: "1h ago",
			},
			{
				icon: "i-mdi:check-circle-outline",
				text: "Health check passed — service ok",
				time: "3h ago",
			},
		],
	},
};

/**
 * Complete panel data for a product page. Live products can override the
 * generated defaults via `detailOverrides`; coming-soon products get a
 * consistent preview panel automatically.
 */
export function getProductDetail(product: Product): ProductDetail {
	const override = detailOverrides[product.key];
	if (override) {
		return override;
	}
	return {
		overview: defaultOverview(product),
		metrics: defaultMetrics(product),
		actions: PREVIEW_ACTIONS,
		activity: PREVIEW_ACTIVITY,
	};
}
