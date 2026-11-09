import { createQuery } from "@tanstack/solid-query";
import { Link, useNavigate } from "@tanstack/solid-router";
import { Alert, Badge, Button } from "@wrikka/solid-ui";
import { For, Show } from "solid-js";
import { orpc } from "../ci/api";
import { fmtPercent, shortSha, timeAgo } from "../ci/format";
import { Card, EmptyState, StatCard, StatusBadge } from "../ci/ui";
import { isAvailable, productGroups, products } from "../data/products";

export function OverviewTab() {
	const navigate = useNavigate();
	const stats = createQuery(() => ({
		queryKey: ["stats"],
		queryFn: () => orpc.stats(),
		retry: 0,
		refetchInterval: 30_000,
	}));
	const runs = createQuery(() => ({
		queryKey: ["runs", "recent", "overview"],
		queryFn: () => orpc.runs.list({ limit: 5 }),
		retry: 0,
		refetchInterval: 30_000,
	}));

	const live = () => products.filter(isAvailable);
	const offline = () => stats.isError && runs.isError;

	return (
		<div>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					label="Products"
					value={products.length}
					icon="i-mdi:grid"
					hint={`${live().length} live · ${products.length - live().length} in preview`}
					accent="brand"
				/>
				<StatCard
					label="CI runs"
					value={stats.data?.totalRuns ?? "—"}
					icon="i-mdi:pipe"
					hint={
						stats.data
							? `${stats.data.running} running · ${stats.data.healed} healed`
							: "Pipeline data unavailable"
					}
					accent="sky"
				/>
				<StatCard
					label="Success rate"
					value={stats.data ? fmtPercent(stats.data.successRate) : "—"}
					icon="i-mdi:check-decagram"
					hint={
						stats.data
							? `${stats.data.succeeded} passed, ${stats.data.failed} failed`
							: "Waiting for the API"
					}
					accent="emerald"
				/>
				<StatCard
					label="Heal rate"
					value={stats.data ? fmtPercent(stats.data.healRate) : "—"}
					icon="i-mdi:auto-fix"
					hint={
						stats.data
							? `${stats.data.healsPushed} fixes pushed of ${stats.data.totalHeals} attempts`
							: "Waiting for the API"
					}
					accent="violet"
				/>
			</div>

			<div class="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
				<section>
					<div class="mb-3 flex items-center justify-between">
						<h2 class="text-sm font-medium text-fg">
							Recent pipeline activity
						</h2>
						<Link
							to="/ci/runs"
							class="text-xs text-dim transition-colors hover:text-acc"
						>
							View all →
						</Link>
					</div>
					<Card class="!p-0 overflow-hidden">
						<Show when={offline()}>
							<Alert variant="warning" title="CI API offline" class="m-4">
								Start the CI worker or set an endpoint in{" "}
								<Link to="/settings" class="text-acc underline">
									Settings
								</Link>
								.
							</Alert>
						</Show>
						<Show when={!offline()}>
							<Show
								when={runs.data?.items.length}
								fallback={
									<EmptyState
										icon="i-mdi:pipe-disconnected"
										title="No runs yet"
										hint="Pushes to the watched repository will appear here."
									/>
								}
							>
								<ul class="divide-y divide-edge">
									<For each={runs.data?.items}>
										{(run) => (
											<li>
												<Link
													to="/ci/runs/$runId"
													params={{ runId: run.id }}
													class="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-raise"
												>
													<StatusBadge status={run.status} />
													<div class="min-w-0 flex-1">
														<p class="truncate text-sm text-fg">
															{run.message ?? run.repo}
														</p>
														<p class="mt-0.5 font-mono text-[11px] text-faint">
															{run.repo}#{shortSha(run.sha)}
														</p>
													</div>
													<span class="shrink-0 text-[11px] text-faint">
														{timeAgo(run.createdAt)}
													</span>
												</Link>
											</li>
										)}
									</For>
								</ul>
							</Show>
						</Show>
					</Card>
				</section>

				<section>
					<div class="mb-3 flex items-center justify-between">
						<h2 class="text-sm font-medium text-fg">Explore the catalog</h2>
						<span class="text-xs text-faint">
							{productGroups.length} categories
						</span>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<For each={productGroups}>
							{(group) => (
								<Link
									to="/products"
									class="rounded-xl border border-edge bg-panel p-4 transition-colors hover:border-acc/40 hover:bg-raise"
								>
									<div class="flex items-start justify-between gap-2">
										<span class="text-sm font-medium text-fg">
											{group.label}
										</span>
										<Badge variant="default" size="sm">
											{products.filter((p) => p.group === group.key).length}
										</Badge>
									</div>
									<div class="mt-3 flex flex-wrap gap-1.5 text-faint">
										<For
											each={products
												.filter((p) => p.group === group.key)
												.slice(0, 4)}
										>
											{(product) => (
												<span
													class={`${product.icon} text-base`}
													title={product.name}
												/>
											)}
										</For>
									</div>
								</Link>
							)}
						</For>
					</div>
				</section>
			</div>

			<div class="mt-6 flex flex-wrap gap-2">
				<Button
					variant="primary"
					size="sm"
					onClick={() => navigate({ to: "/ci" })}
				>
					<span class="i-mdi:pipe" /> Open CI pipeline
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={() => navigate({ to: "/products" })}
				>
					<span class="i-mdi:grid" /> All apps
				</Button>
			</div>
		</div>
	);
}
