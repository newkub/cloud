import { createFileRoute, getRouteApi } from "@tanstack/solid-router";
import { createSignal, For, Show } from "solid-js";
import { isAvailable, productGroups } from "../data/products";

export const Route = createFileRoute("/products/$slug/")({
	component: ProductOverview,
});

const parent = getRouteApi("/products/$slug");

const TABS = [
	{ id: "overview", label: "Overview", icon: "i-mdi:view-dashboard-outline" },
	{ id: "metrics", label: "Metrics", icon: "i-mdi:chart-box-outline" },
	{ id: "activity", label: "Activity", icon: "i-mdi:pulse" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function ProductOverview() {
	const data = parent.useLoaderData();
	const product = () => data().product;
	const detail = () => data().detail;
	const group = () =>
		productGroups.find((g) => g.key === product().group)?.label ?? "Platform";
	const [tab, setTab] = createSignal<TabId>("overview");
	const [notifySet, setNotifySet] = createSignal(false);

	return (
		<div>
			<Show when={!isAvailable(product())}>
				<div class="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-edge bg-panel/50 px-4 py-3">
					<span class="i-mdi:rocket-launch-outline shrink-0 text-lg text-faint" />
					<p class="min-w-40 flex-1 text-sm text-dim">
						{product().name} is in development — this console previews the app,
						docs, settings and logs with sample data.
					</p>
					<Show
						when={!notifySet()}
						fallback={
							<span class="inline-flex items-center gap-1.5 rounded-lg border border-acc/40 bg-acc/10 px-3 py-1.5 text-sm text-acc">
								<span class="i-mdi:check" />
								You’re on the list
							</span>
						}
					>
						<button
							type="button"
							onClick={() => setNotifySet(true)}
							class="rounded-lg border border-acc/40 bg-acc/10 px-3 py-1.5 text-sm text-acc hover:bg-acc/20"
						>
							Notify me
						</button>
					</Show>
				</div>
			</Show>

			<div class="mb-6 flex gap-1 overflow-x-auto border-b border-edge">
				<For each={TABS}>
					{(item) => (
						<a
							href={`#${item.id}`}
							aria-current={tab() === item.id ? "page" : undefined}
							onClick={(event) => {
								event.preventDefault();
								setTab(item.id);
							}}
							class={`-mb-px flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors ${
								tab() === item.id
									? "border-acc font-medium text-acc"
									: "border-transparent text-dim hover:border-edge hover:text-fg"
							}`}
						>
							<span class={`${item.icon} text-base`} />
							{item.label}
						</a>
					)}
				</For>
			</div>

			<Show when={tab() === "overview"}>
				<div class="grid gap-6 lg:grid-cols-5">
					<section class="lg:col-span-3">
						<h2 class="mb-3 text-xs font-medium uppercase tracking-wider text-faint">
							About {product().name}
						</h2>
						<div class="rounded-xl border border-edge bg-panel p-5">
							<p class="text-sm leading-relaxed text-dim">
								{detail().overview}
							</p>
							<div class="mt-4 flex flex-wrap gap-2 text-xs">
								<span class="rounded-full border border-edge bg-ink px-2.5 py-1 text-dim">
									{group()}
								</span>
								<span class="rounded-full border border-edge bg-ink px-2.5 py-1 text-dim">
									/products/{product().key}
								</span>
								<Show when={isAvailable(product())}>
									<span class="rounded-full border border-acc/30 bg-acc/10 px-2.5 py-1 text-acc">
										Generally available
									</span>
								</Show>
							</div>
						</div>
					</section>

					<section class="lg:col-span-2">
						<h2 class="mb-3 text-xs font-medium uppercase tracking-wider text-faint">
							At a glance
						</h2>
						<div class="grid grid-cols-2 gap-3">
							<For each={detail().metrics}>
								{(metric) => (
									<div class="rounded-xl border border-edge bg-panel p-4">
										<p class="text-xs text-faint">{metric.label}</p>
										<p class="mt-1 text-lg font-semibold tabular-nums">
											{metric.value}
										</p>
									</div>
								)}
							</For>
						</div>
					</section>
				</div>
			</Show>

			<Show when={tab() === "metrics"}>
				<section>
					<h2 class="mb-3 text-xs font-medium uppercase tracking-wider text-faint">
						Key metrics
					</h2>
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
						<For each={detail().metrics}>
							{(metric) => (
								<div class="rounded-xl border border-edge bg-panel p-4">
									<p class="text-xs text-faint">{metric.label}</p>
									<p class="mt-1 text-xl font-semibold tabular-nums">
										{metric.value}
									</p>
									<Show when={metric.delta}>
										<p
											class={`mt-1 text-xs ${
												metric.up === false ? "text-err" : "text-ok"
											}`}
										>
											{metric.delta} vs last week
										</p>
									</Show>
								</div>
							)}
						</For>
					</div>
					<p class="mt-2 text-xs text-faint">
						{isAvailable(product())
							? "Live counts stream in as usage is recorded — sample data shown."
							: "Preview data — live metrics ship with the product console."}
					</p>
				</section>
			</Show>

			<Show when={tab() === "activity"}>
				<section>
					<h2 class="mb-3 text-xs font-medium uppercase tracking-wider text-faint">
						Recent activity
					</h2>
					<ul class="divide-y divide-edge rounded-xl border border-edge bg-panel">
						<For each={detail().activity}>
							{(item) => (
								<li class="flex items-start gap-3 px-4 py-3">
									<span
										class={`${item.icon} mt-0.5 shrink-0 text-lg text-faint`}
									/>
									<div class="min-w-0">
										<p class="text-sm text-fg">{item.text}</p>
										<p class="mt-0.5 text-xs text-faint">{item.time}</p>
									</div>
								</li>
							)}
						</For>
					</ul>
					<p class="mt-2 text-xs text-faint">
						{isAvailable(product())
							? "Latest events from the service."
							: "Preview feed — real events appear after launch."}
					</p>
				</section>
			</Show>
		</div>
	);
}
