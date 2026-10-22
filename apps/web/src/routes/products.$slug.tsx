import { createFileRoute, Link, notFound } from "@tanstack/solid-router";
import { createSignal, For, Show } from "solid-js";
import { StatusBadge } from "../components/StatusBadge";
import {
	getProduct,
	getProductDetail,
	isAvailable,
	type ProductAction,
	productGroups,
} from "../data/products";

export const Route = createFileRoute("/products/$slug")({
	loader: ({ params }) => {
		const product = getProduct(params.slug);
		if (!product) {
			throw notFound();
		}
		return { product, detail: getProductDetail(product) };
	},
	component: ProductPage,
});

function ProductPage() {
	const data = Route.useLoaderData();
	const product = () => data().product;
	const detail = () => data().detail;
	const group = () =>
		productGroups.find((g) => g.key === product().group)?.label ?? "Platform";
	const [notifySet, setNotifySet] = createSignal(false);

	return (
		<div class="mx-auto max-w-5xl px-6 py-8">
			<nav class="mb-6 flex items-center gap-1.5 text-sm text-faint">
				<Link to="/" class="hover:text-dim">
					Products
				</Link>
				<span class="i-mdi:chevron-right text-xs" />
				<span class="text-dim">{product().name}</span>
			</nav>

			<header class="flex items-center gap-4">
				<span
					class={`flex h-14 w-14 items-center justify-center rounded-xl border border-edge bg-panel text-3xl ${
						isAvailable(product()) ? "text-acc" : "text-faint"
					}`}
				>
					<span class={product().icon} />
				</span>
				<div class="min-w-0">
					<div class="flex items-center gap-3">
						<h1 class="text-2xl font-semibold tracking-tight">
							{product().name}
						</h1>
						<StatusBadge status={product().status} />
					</div>
					<p class="mt-1 text-sm text-dim">{product().description}</p>
				</div>
			</header>

			{/* Quick actions */}
			<div class="mt-6 flex flex-wrap gap-2">
				<For each={detail().actions}>
					{(action) => <ActionButton action={action} />}
				</For>
			</div>

			{/* Coming-soon notice — panel below stays as a preview */}
			<Show when={!isAvailable(product())}>
				<div class="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-edge bg-panel/50 px-4 py-3">
					<span class="i-mdi:rocket-launch-outline shrink-0 text-lg text-faint" />
					<p class="min-w-40 flex-1 text-sm text-dim">
						{product().name} is in development — the panel below previews its
						console with sample data.
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

			{/* Key metrics */}
			<section class="mt-8">
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

			{/* Overview + recent activity */}
			<div class="mt-8 grid gap-6 lg:grid-cols-5">
				<section class="lg:col-span-3">
					<h2 class="mb-3 text-xs font-medium uppercase tracking-wider text-faint">
						Overview
					</h2>
					<div class="rounded-xl border border-edge bg-panel p-5">
						<p class="text-sm leading-relaxed text-dim">{detail().overview}</p>
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
			</div>
		</div>
	);
}

function ActionButton(props: { action: ProductAction }) {
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
			<a
				href={props.action.href}
				target="_blank"
				rel="noreferrer"
				class={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm ${
					props.action.primary
						? "border-acc/40 bg-acc/10 text-acc hover:bg-acc/20"
						: "border-edge bg-panel text-dim hover:border-acc/40 hover:text-fg"
				}`}
			>
				<span class={props.action.icon} />
				{props.action.label}
				<span class="i-mdi:open-in-new text-xs opacity-70" />
			</a>
		</Show>
	);
}
