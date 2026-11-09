import { createFileRoute, getRouteApi, Link } from "@tanstack/solid-router";
import { For, Show } from "solid-js";
import { Card, MetaRow } from "../ci/ui";
import { isAvailable, productGroups } from "../data/products";
import { SectionLayout } from "../shell/SectionLayout";

export const Route = createFileRoute("/products/$slug/settings")({
	component: ProductSettings,
});

const parent = getRouteApi("/products/$slug");

const SECTIONS = [
	{ id: "details", label: "Details" },
	{ id: "console", label: "Console" },
	{ id: "preferences", label: "Preferences" },
];

function ProductSettings() {
	const data = parent.useLoaderData();
	const product = () => data().product;
	const live = () => isAvailable(product());
	const group = () =>
		productGroups.find((g) => g.key === product().group)?.label ?? "Platform";
	const links = () =>
		data().detail.actions.filter(
			(action) => action.href && action.href !== "#",
		);

	return (
		<SectionLayout sections={SECTIONS} label={`${product().name} settings`}>
			<div class="space-y-4">
				<section id="details" class="scroll-mt-24">
					<Card>
						<h2 class="text-base font-semibold text-fg">Details</h2>
						<p class="mt-1 text-sm leading-relaxed text-dim">
							Identity of this product inside the Wrikka Cloud workspace.
						</p>
						<div class="mt-4 divide-y divide-edge">
							<MetaRow label="Product">{product().name}</MetaRow>
							<MetaRow label="Slug">
								<code class="font-mono text-xs text-fg">
									/products/{product().key}
								</code>
							</MetaRow>
							<MetaRow label="Category">{group()}</MetaRow>
							<MetaRow label="Status">
								<span
									class={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
										live()
											? "border-acc/30 bg-acc/10 text-acc"
											: "border-edge bg-raise text-faint"
									}`}
								>
									{live() ? "live" : "coming soon"}
								</span>
							</MetaRow>
							<MetaRow label="Availability">
								{live() ? "Generally available" : "In active development"}
							</MetaRow>
						</div>
					</Card>
				</section>

				<section id="console" class="scroll-mt-24">
					<Card>
						<h2 class="text-base font-semibold text-fg">Console</h2>
						<p class="mt-1 text-sm leading-relaxed text-dim">
							External consoles and endpoints bound to this product.
						</p>
						<Show
							when={links().length > 0}
							fallback={
								<p class="mt-4 rounded-lg border border-dashed border-edge bg-ink/50 px-4 py-3 text-sm text-faint">
									No external console yet — it is wired when the product ships.
								</p>
							}
						>
							<ul class="mt-4 divide-y divide-edge">
								<For each={links()}>
									{(action) => (
										<li>
											<a
												href={action.href}
												target="_blank"
												rel="noreferrer"
												class="flex items-center gap-3 py-2.5 text-sm text-dim transition-colors hover:text-acc"
											>
												<span class={`${action.icon} text-base`} />
												<span class="flex-1">{action.label}</span>
												<span class="truncate font-mono text-[11px] text-faint">
													{action.href}
												</span>
												<span class="i-mdi:open-in-new text-xs" />
											</a>
										</li>
									)}
								</For>
							</ul>
						</Show>
						<div class="mt-4 flex flex-wrap gap-2">
							<Link
								to="/products/$slug/docs"
								params={{ slug: product().key }}
								class="inline-flex items-center gap-1.5 rounded-lg border border-edge bg-panel px-3 py-1.5 text-sm text-dim transition-colors hover:border-acc/40 hover:text-fg"
							>
								<span class="i-mdi:book-open-variant" />
								Product docs
							</Link>
							<Link
								to="/products/$slug/logs"
								params={{ slug: product().key }}
								class="inline-flex items-center gap-1.5 rounded-lg border border-edge bg-panel px-3 py-1.5 text-sm text-dim transition-colors hover:border-acc/40 hover:text-fg"
							>
								<span class="i-mdi:math-log" />
								Open logs
							</Link>
						</div>
					</Card>
				</section>

				<section id="preferences" class="scroll-mt-24">
					<Card>
						<h2 class="text-base font-semibold text-fg">Preferences</h2>
						<p class="mt-1 text-sm leading-relaxed text-dim">
							Appearance — mode, accent color and reduced motion — is shared by
							every app in the workspace and stored locally in this browser.
						</p>
						<Link
							to="/settings"
							class="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-acc/40 bg-acc/10 px-3 py-1.5 text-sm text-acc transition-colors hover:bg-acc/20"
						>
							<span class="i-mdi:palette-outline" />
							Open Cloud settings
						</Link>
					</Card>
				</section>
			</div>
		</SectionLayout>
	);
}
