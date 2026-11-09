import { createQuery } from "@tanstack/solid-query";
import { For, Show } from "solid-js";
import { orpc } from "../api";
import { fmtTime } from "../format";
import { Card, ErrorState, Loading, MetaRow } from "../ui";

export function PipelineCard() {
	const config = createQuery(() => ({
		queryKey: ["config"],
		queryFn: () => orpc.watch.config(),
		retry: 0,
	}));

	return (
		<Card>
			<div class="mb-3 flex items-center gap-2">
				<span class="i-mdi:pipe text-lg text-acc" />
				<h2 class="text-sm font-medium text-fg">Pipeline</h2>
			</div>
			<Show
				when={config.isError}
				fallback={
					<Show when={config.data} fallback={<Loading />}>
						{(c) => (
							<div>
								<MetaRow label="Namespace">
									<span class="font-mono">{c().namespace}</span>
								</MetaRow>
								<MetaRow label="Repository">
									<span class="font-mono">{c().repo}</span>
								</MetaRow>
								<MetaRow label="Backup bucket">
									<span class="font-mono">{c().backupBucket}</span>
								</MetaRow>
								<MetaRow label="Healer model">
									<span class="font-mono">{c().model}</span>
								</MetaRow>
							</div>
						)}
					</Show>
				}
			>
				<ErrorState message="Could not load the pipeline configuration." />
			</Show>
		</Card>
	);
}

export function WorkerCard() {
	const health = createQuery(() => ({
		queryKey: ["health"],
		queryFn: () => orpc.health(),
		retry: 0,
	}));

	const bindingRows = () => [
		{ label: "Artifacts", name: "ARTIFACTS", icon: "i-mdi:package-variant" },
		{ label: "Workers AI", name: "AI", icon: "i-mdi:robot-outline" },
		{
			label: "R2 backups",
			name: "BACKUP_BUCKET",
			icon: "i-mdi:bucket-outline",
		},
		{ label: "CI sandbox", name: "SANDBOX", icon: "i-mdi:cube-outline" },
		{ label: "Healer agent", name: "HEALER", icon: "i-mdi:bandage" },
		{
			label: "Run registry",
			name: "REGISTRY",
			icon: "i-mdi:database-outline",
		},
		{ label: "CI workflow", name: "CI_WORKFLOW", icon: "i-mdi:pipe" },
		{ label: "Static assets", name: "ASSETS", icon: "i-mdi:web" },
	];

	return (
		<Card>
			<div class="mb-3 flex items-center justify-between gap-2">
				<div class="flex items-center gap-2">
					<span class="i-mdi:cloud-check-outline text-lg text-acc" />
					<h2 class="text-sm font-medium text-fg">Worker status</h2>
				</div>
				<Show
					when={health.data}
					fallback={
						<span
							class={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
								health.isError
									? "border-err/30 bg-err/15 text-err"
									: "border-edge text-faint"
							}`}
						>
							<span class="h-1.5 w-1.5 rounded-full bg-current" />
							{health.isError ? "offline" : "checking…"}
						</span>
					}
				>
					{(h) => (
						<span
							class={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
								h().ok
									? "border-ok/30 bg-ok/15 text-ok"
									: "border-err/30 bg-err/15 text-err"
							}`}
						>
							<span class="h-1.5 w-1.5 rounded-full bg-current" />
							{h().ok ? "healthy" : "degraded"}
						</span>
					)}
				</Show>
			</div>
			<div class="space-y-1">
				<For each={bindingRows()}>
					{(row) => (
						<div class="flex items-center justify-between border-b border-edge py-2 last:border-0">
							<span class="flex items-center gap-2.5 text-sm text-dim">
								<span class={`${row.icon} text-faint`} />
								{row.label}
							</span>
							<span class="font-mono text-xs text-faint">{row.name}</span>
						</div>
					)}
				</For>
			</div>
			<Show when={health.isError}>
				<p class="mt-3 text-xs text-err">
					The worker did not respond — start it or point the console at another
					endpoint in Connection.
				</p>
			</Show>
			<Show when={health.data?.ok === false}>
				<p class="mt-3 text-xs text-err">{health.data?.bindings}</p>
			</Show>
			<Show when={health.data}>
				<p class="mt-3 text-xs text-faint">
					Checked {fmtTime(health.data?.time)}
				</p>
			</Show>
		</Card>
	);
}

export function HowItWorksCard() {
	return (
		<Card>
			<div class="mb-2 flex items-center gap-2">
				<span class="i-mdi:help-circle-outline text-lg text-acc" />
				<h2 class="text-sm font-medium text-fg">How it works</h2>
			</div>
			<ol class="list-inside list-decimal space-y-2 text-sm leading-relaxed text-dim">
				<li>
					A push to the watched Artifacts repository triggers the CI workflow.
				</li>
				<li>
					The pipeline runs install → lint, test, typecheck, build in a Sandbox.
				</li>
				<li>
					On failure, the Healing Agent opens a sandbox, fixes the code, and
					re-verifies every failed command.
				</li>
				<li>
					A verified fix is pushed to a{" "}
					<code class="font-mono text-xs text-fg">
						ci-autofix/&lt;run-id&gt;
					</code>{" "}
					branch and a pull request is opened.
				</li>
			</ol>
		</Card>
	);
}
