import { createQuery } from "@tanstack/solid-query";
import { Link } from "@tanstack/solid-router";
import { For, Show } from "solid-js";
import { orpc } from "../ci/api";
import { shortSha, timeAgo } from "../ci/format";
import { Card, EmptyState, HealBadge, StatusBadge } from "../ci/ui";

export function ActivityTab() {
	const runs = createQuery(() => ({
		queryKey: ["runs", "recent", "activity"],
		queryFn: () => orpc.runs.list({ limit: 10 }),
		retry: 0,
		refetchInterval: 15_000,
	}));
	const heals = createQuery(() => ({
		queryKey: ["heals", "recent", "activity"],
		queryFn: () => orpc.heals.list({ limit: 6 }),
		retry: 0,
		refetchInterval: 15_000,
	}));

	return (
		<div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
			<section class="xl:col-span-2">
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-sm font-medium text-fg">Pipeline runs</h2>
					<Link
						to="/ci/runs"
						class="text-xs text-dim transition-colors hover:text-acc"
					>
						View all →
					</Link>
				</div>
				<Card class="!p-0 overflow-hidden">
					<Show
						when={runs.data?.items.length}
						fallback={
							<EmptyState
								icon="i-mdi:pipe-disconnected"
								title="No runs yet"
								hint="Pipeline activity will appear here once the CI worker is reachable."
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
													<span class="text-faint">
														{" "}
														· {run.branch ?? run.ref}
													</span>
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
				</Card>
			</section>

			<section>
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-sm font-medium text-fg">Heal attempts</h2>
					<Link
						to="/ci/heals"
						class="text-xs text-dim transition-colors hover:text-acc"
					>
						View all →
					</Link>
				</div>
				<Card class="!p-0 overflow-hidden">
					<Show
						when={heals.data?.items.length}
						fallback={
							<EmptyState
								icon="i-mdi:auto-fix"
								title="No heal attempts"
								hint="Failed runs that trigger the self-healing agent show up here."
							/>
						}
					>
						<ul class="divide-y divide-edge">
							<For each={heals.data?.items}>
								{(heal) => (
									<li>
										<Link
											to="/ci/runs/$runId"
											params={{ runId: heal.runId }}
											class="flex flex-col gap-1.5 px-4 py-3 transition-colors hover:bg-raise"
										>
											<div class="flex items-center justify-between gap-2">
												<HealBadge status={heal.status} />
												<span class="text-[11px] text-faint">
													{timeAgo(heal.startedAt)}
												</span>
											</div>
											<p class="truncate font-mono text-[11px] text-faint">
												{heal.runId}
											</p>
											<p class="truncate text-[12px] text-dim">
												{heal.prUrl
													? `PR #${heal.prNumber} · ${heal.steps} steps`
													: heal.error
														? heal.error
														: `${heal.steps} steps`}
											</p>
										</Link>
									</li>
								)}
							</For>
						</ul>
					</Show>
				</Card>
			</section>
		</div>
	);
}
