import { createQuery } from "@tanstack/solid-query";
import { Link } from "@tanstack/solid-router";
import { For, Show } from "solid-js";
import { orpc } from "../api";
import { fmtDuration, fmtTime, shortSha, timeAgo } from "../format";
import {
	Card,
	ErrorState,
	HealBadge,
	Loading,
	LogBlock,
	MetaRow,
	StatusBadge,
} from "../ui";

export function RunDetail(props: { runId: string }) {
	const runId = () => props.runId;

	const run = createQuery(() => ({
		queryKey: ["runs", "detail", runId()],
		queryFn: () => orpc.runs.get({ id: runId() }),
		retry: 0,
	}));

	return (
		<div>
			<Link
				to="/ci/runs"
				class="inline-flex items-center gap-1.5 text-sm text-dim hover:text-fg transition-colors mb-4"
			>
				<span class="i-mdi:arrow-left" /> Back to runs
			</Link>

			<Show
				when={run.data}
				fallback={
					<Show
						when={run.isPending}
						fallback={<ErrorState message="Run not found or failed to load." />}
					>
						<Loading />
					</Show>
				}
			>
				{(r) => (
					<div>
						<div class="flex flex-wrap items-center gap-3 mb-6">
							<h2 class="text-xl font-semibold text-fg font-mono">
								{r().id.slice(0, 12)}…
							</h2>
							<StatusBadge status={r().status} />
							<span class="text-sm text-faint">{timeAgo(r().createdAt)}</span>
						</div>

						<div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
							<Card class="xl:col-span-2">
								<h3 class="font-medium text-fg mb-3">Run</h3>
								<div>
									<MetaRow label="Repository">
										<span class="font-mono">
											{r().owner}/{r().repo}
										</span>
									</MetaRow>
									<MetaRow label="Ref">
										<span class="font-mono">{r().ref}</span>
									</MetaRow>
									<MetaRow label="Commit">
										<span class="font-mono" title={r().sha}>
											{shortSha(r().sha)}
										</span>
									</MetaRow>
									<MetaRow label="Trigger">{r().trigger}</MetaRow>
									<MetaRow label="Actor">{r().actor ?? "—"}</MetaRow>
									<MetaRow label="Message">{r().message ?? "—"}</MetaRow>
									<MetaRow label="Started">{fmtTime(r().createdAt)}</MetaRow>
									<MetaRow label="Duration">
										{fmtDuration(r().createdAt, r().finishedAt)}
									</MetaRow>
								</div>
							</Card>

							<Card>
								<h3 class="font-medium text-fg mb-3">Heal attempt</h3>
								<Show
									when={r().heal}
									fallback={
										<p class="text-sm text-faint">
											No heal attempt for this run.
										</p>
									}
								>
									{(heal) => (
										<div class="space-y-3">
											<div class="flex items-center justify-between">
												<HealBadge status={heal().status} />
												<span class="text-xs text-faint">
													{heal().steps} steps
												</span>
											</div>
											<Show when={heal().branch}>
												<div class="text-sm">
													<div class="text-faint text-xs mb-1">Fix branch</div>
													<div class="font-mono text-fg break-all">
														{heal().branch}
													</div>
												</div>
											</Show>
											<Show when={heal().prUrl}>
												<a
													href={heal().prUrl ?? "#"}
													target="_blank"
													rel="noreferrer"
													class="inline-flex items-center gap-2 input-chip text-violet-300 !border-violet-500/40 hover:!bg-violet-500/10"
												>
													<span class="i-mdi:source-pull" />
													Open pull request
													{heal().prNumber ? ` #${heal().prNumber}` : ""}
												</a>
											</Show>
											<Show when={heal().error}>
												<div class="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 break-all">
													{heal().error}
												</div>
											</Show>
											<Link
												to="/ci/heals/$runId"
												params={{ runId: r().id }}
												class="inline-flex items-center gap-1.5 text-sm text-acc hover:text-acc transition-colors"
											>
												Heal details →
											</Link>
										</div>
									)}
								</Show>
							</Card>
						</div>

						<Show when={r().failures.length > 0}>
							<Card class="mt-4">
								<h3 class="font-medium text-fg mb-3">
									Failures ({r().failures.length})
								</h3>
								<div class="space-y-3">
									<For each={r().failures}>
										{(failure, index) => (
											<details class="group border border-edge rounded-lg overflow-hidden">
												<summary class="flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-raise transition-colors">
													<span class="i-mdi:close-circle text-rose-400" />
													<span class="font-mono text-sm text-fg flex-1 truncate">
														{failure.runner.command}
													</span>
													<span class="text-xs text-faint">
														{failure.runner.name}
													</span>
													<span class="i-mdi:chevron-down text-faint group-open:rotate-180 transition-transform" />
													<span class="sr-only">Failure {index() + 1}</span>
												</summary>
												<div class="px-4 pb-3">
													<LogBlock text={failure.output} />
												</div>
											</details>
										)}
									</For>
								</div>
							</Card>
						</Show>
					</div>
				)}
			</Show>
		</div>
	);
}
