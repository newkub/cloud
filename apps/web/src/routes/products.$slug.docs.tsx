import { createFileRoute, getRouteApi, Link } from "@tanstack/solid-router";
import { For, Show } from "solid-js";
import { Card } from "../ci/ui";
import {
	isAvailable,
	type ProductAction,
	productGroups,
} from "../data/products";
import { SectionLayout } from "../shell/SectionLayout";

export const Route = createFileRoute("/products/$slug/docs")({
	component: ProductDocs,
});

const parent = getRouteApi("/products/$slug");

const SECTIONS = [
	{ id: "overview", label: "Overview" },
	{ id: "getting-started", label: "Getting started" },
	{ id: "console", label: "Console" },
	{ id: "configuration", label: "Configuration" },
];

const STEPS = [
	{
		icon: "i-mdi:view-dashboard-outline",
		title: "Open the console",
		body: "The App tab holds the product overview, live metrics and recent activity.",
	},
	{
		icon: "i-mdi:math-log",
		title: "Stream events",
		body: "The Logs tab keeps a feed of everything the service reports, filterable by level.",
	},
	{
		icon: "i-mdi:cog-outline",
		title: "Configure the app",
		body: "Settings covers product details, console links and workspace-wide preferences.",
	},
];

function ProductDocs() {
	const data = parent.useLoaderData();
	const product = () => data().product;
	const group = () =>
		productGroups.find((g) => g.key === product().group)?.label ?? "Platform";
	const live = () => isAvailable(product());

	return (
		<SectionLayout sections={SECTIONS} label={`${product().name} docs`}>
			<div class="space-y-4">
				<section id="overview" class="scroll-mt-24">
					<Card>
						<div class="mb-1 flex flex-wrap items-center gap-2">
							<h2 class="text-base font-semibold text-fg">
								{product().name} documentation
							</h2>
							<span
								class={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
									live()
										? "border-acc/30 bg-acc/10 text-acc"
										: "border-edge bg-raise text-faint"
								}`}
							>
								{live() ? "live" : "preview"}
							</span>
						</div>
						<p class="text-sm leading-relaxed text-dim">
							{data().detail.overview}
						</p>
						<div class="mt-4 flex flex-wrap gap-2 text-xs">
							<span class="rounded-full border border-edge bg-ink px-2.5 py-1 text-dim">
								{group()}
							</span>
							<code class="rounded-full border border-edge bg-ink px-2.5 py-1 font-mono text-acc">
								/products/{product().key}
							</code>
							<span class="rounded-full border border-edge bg-ink px-2.5 py-1 text-dim">
								{live() ? "Generally available" : "In development"}
							</span>
						</div>
					</Card>
				</section>

				<section id="getting-started" class="scroll-mt-24">
					<Card>
						<h2 class="text-base font-semibold text-fg">Getting started</h2>
						<p class="mt-1 text-sm leading-relaxed text-dim">
							Every product app shares the same shape — an app overview, this
							documentation, settings and logs.
						</p>
						<div class="mt-4 space-y-2">
							<For each={STEPS}>
								{(step, index) => (
									<div class="flex items-start gap-3 rounded-lg border border-edge bg-ink px-4 py-3">
										<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-edge text-xs tabular-nums text-dim">
											{index() + 1}
										</span>
										<div class="min-w-0">
											<p class="flex items-center gap-2 text-sm text-fg">
												<span class={`${step.icon} text-acc`} />
												{step.title}
											</p>
											<p class="mt-0.5 text-xs leading-relaxed text-dim">
												{step.body}
											</p>
										</div>
									</div>
								)}
							</For>
						</div>
					</Card>
				</section>

				<section id="console" class="scroll-mt-24">
					<Card>
						<h2 class="text-base font-semibold text-fg">Console</h2>
						<p class="mt-1 text-sm leading-relaxed text-dim">
							Jump straight to the product surfaces. External consoles open in a
							new tab.
						</p>
						<div class="mt-4 grid gap-2 sm:grid-cols-2">
							<TabLink
								to="/products/$slug"
								slug={product().key}
								icon="i-mdi:view-dashboard-outline"
								title="App overview"
								description="Metrics, status and recent activity"
							/>
							<TabLink
								to="/products/$slug/settings"
								slug={product().key}
								icon="i-mdi:cog-outline"
								title="Settings"
								description="Product details and preferences"
							/>
							<TabLink
								to="/products/$slug/logs"
								slug={product().key}
								icon="i-mdi:math-log"
								title="Logs"
								description="Event feed with level filters"
							/>
							<For each={data().detail.actions}>
								{(action) => <ActionLink action={action} />}
							</For>
						</div>
					</Card>
				</section>

				<section id="configuration" class="scroll-mt-24">
					<Card>
						<h2 class="text-base font-semibold text-fg">Configuration</h2>
						<div class="mt-3 space-y-3 text-sm leading-relaxed text-dim">
							<p>
								Endpoints, tokens and secrets live in the workspace environment
								— never in the console bundle. Product credentials are read at
								runtime by the service worker.
							</p>
							<p>
								Appearance preferences — mode, accent color and reduced motion —
								are shared by every app and persist in local storage. Change
								them from{" "}
								<Link to="/settings" class="text-acc hover:underline">
									Cloud settings
								</Link>
								.
							</p>
						</div>
					</Card>
				</section>
			</div>
		</SectionLayout>
	);
}

function TabLink(props: {
	to: "/products/$slug" | "/products/$slug/settings" | "/products/$slug/logs";
	slug: string;
	icon: string;
	title: string;
	description: string;
}) {
	return (
		<Link
			to={props.to}
			params={{ slug: props.slug }}
			class="group flex items-start gap-3 rounded-lg border border-edge bg-ink px-3 py-3 transition-colors hover:border-acc/40 hover:bg-raise"
		>
			<span class={`${props.icon} mt-0.5 text-lg text-acc`} />
			<span class="min-w-0">
				<span class="block text-sm text-fg group-hover:text-acc">
					{props.title}
				</span>
				<span class="block text-xs text-faint">{props.description}</span>
			</span>
		</Link>
	);
}

function ActionLink(props: { action: ProductAction }) {
	const external = () =>
		Boolean(props.action.href) && props.action.href !== "#";
	const body = (
		<>
			<span class={`${props.action.icon} mt-0.5 text-lg text-acc`} />
			<span class="min-w-0">
				<span class="block text-sm text-fg">{props.action.label}</span>
				<span class="block text-xs text-faint">
					{props.action.disabled
						? "Available when the product ships"
						: external()
							? "Opens in a new tab"
							: "Console"}
				</span>
			</span>
		</>
	);

	return (
		<Show
			when={!props.action.disabled && external()}
			fallback={
				<span class="flex items-start gap-3 rounded-lg border border-dashed border-edge bg-ink/50 px-3 py-3 text-faint">
					{body}
				</span>
			}
		>
			<a
				href={props.action.href}
				target="_blank"
				rel="noreferrer"
				class="group flex items-start gap-3 rounded-lg border border-edge bg-ink px-3 py-3 transition-colors hover:border-acc/40 hover:bg-raise"
			>
				{body}
			</a>
		</Show>
	);
}
