import {
	createFileRoute,
	Link,
	notFound,
	Outlet,
	redirect,
	useLocation,
	useNavigate,
} from "@tanstack/solid-router";
import { For, Show } from "solid-js";
import {
	getProduct,
	getProductDetail,
	isAvailable,
	type ProductAction,
} from "../data/products";
import { AppFrame } from "../shell/AppFrame";
import { APP_TAB_META, type AppTabId, type AppTabItem } from "../shell/apps";

export const Route = createFileRoute("/products/$slug")({
	beforeLoad: ({ params }) => {
		if (params.slug === "ci") {
			throw redirect({ to: "/ci" });
		}
	},
	loader: ({ params }) => {
		const product = getProduct(params.slug);
		if (!product) {
			throw notFound();
		}
		return { product, detail: getProductDetail(product) };
	},
	component: ProductLayout,
});

function ProductLayout() {
	const data = Route.useLoaderData();
	const pathname = useLocation({ select: (location) => location.pathname });
	const navigate = useNavigate();
	const product = () => data().product;
	const detail = () => data().detail;
	const base = () => `/products/${product().key}`;

	const activeTab = (): AppTabId => {
		const path = pathname();
		if (path === `${base()}/docs`) {
			return "docs";
		}
		if (path === `${base()}/settings`) {
			return "settings";
		}
		if (path === `${base()}/logs`) {
			return "logs";
		}
		return "app";
	};

	const tabs = (): AppTabItem[] => {
		const slug = product().key;
		return [
			{
				...APP_TAB_META.app,
				active: activeTab() === "app",
				href: base(),
				onSelect: () => navigate({ to: "/products/$slug", params: { slug } }),
			},
			{
				...APP_TAB_META.docs,
				active: activeTab() === "docs",
				href: `${base()}/docs`,
				onSelect: () =>
					navigate({ to: "/products/$slug/docs", params: { slug } }),
			},
			{
				...APP_TAB_META.settings,
				active: activeTab() === "settings",
				href: `${base()}/settings`,
				onSelect: () =>
					navigate({ to: "/products/$slug/settings", params: { slug } }),
			},
			{
				...APP_TAB_META.logs,
				active: activeTab() === "logs",
				href: `${base()}/logs`,
				onSelect: () =>
					navigate({ to: "/products/$slug/logs", params: { slug } }),
			},
		];
	};

	return (
		<AppFrame
			icon={product().icon}
			name={product().name}
			description={product().description}
			status={product().status}
			live={isAvailable(product())}
			tabs={tabs()}
			actions={
				<div class="flex flex-wrap gap-2">
					<For each={detail().actions}>
						{(action) => <ActionButton action={action} />}
					</For>
				</div>
			}
		>
			<Outlet />
		</AppFrame>
	);
}

function ActionButton(props: { action: ProductAction }) {
	const cls = () =>
		`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm ${
			props.action.primary
				? "border-acc/40 bg-acc/10 text-acc hover:bg-acc/20"
				: "border-edge bg-panel text-dim hover:border-acc/40 hover:text-fg"
		}`;

	const content = () => (
		<>
			<span class={props.action.icon} />
			{props.action.label}
			<span
				class={`text-xs opacity-70 ${
					props.action.route ? "i-mdi:chevron-right" : "i-mdi:open-in-new"
				}`}
			/>
		</>
	);

	return (
		<Show
			when={!props.action.disabled}
			fallback={
				<span
					title="Available when the product ships"
					class="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-edge bg-panel px-3 py-1.5 text-sm text-faint"
				>
					<span class={props.action.icon} />
					{props.action.label}
				</span>
			}
		>
			<Show
				when={props.action.route}
				fallback={
					<a
						href={props.action.href}
						target="_blank"
						rel="noreferrer"
						class={cls()}
					>
						{content()}
					</a>
				}
			>
				{(route) => (
					<Show
						when={route() === "/ci"}
						fallback={
							<Show
								when={route() === "/ci/runs"}
								fallback={
									<Show
										when={route() === "/ci/heals"}
										fallback={
											<Show
												when={route() === "/ci/logs"}
												fallback={
													<Link to="/ci/settings" class={cls()}>
														{content()}
													</Link>
												}
											>
												<Link to="/ci/logs" class={cls()}>
													{content()}
												</Link>
											</Show>
										}
									>
										<Link to="/ci/heals" class={cls()}>
											{content()}
										</Link>
									</Show>
								}
							>
								<Link to="/ci/runs" class={cls()}>
									{content()}
								</Link>
							</Show>
						}
					>
						<Link to="/ci" class={cls()}>
							{content()}
						</Link>
					</Show>
				)}
			</Show>
		</Show>
	);
}
