import { createFileRoute, Link } from "@tanstack/solid-router";
import { Badge } from "@wrikka/solid-ui";
import { For } from "solid-js";
import { Card } from "../ci/ui";
import { SectionLayout } from "../shell/SectionLayout";

export const Route = createFileRoute("/ci/docs")({ component: CiDocs });

const SECTIONS = [
	{ id: "overview", label: "Overview" },
	{ id: "stages", label: "Pipeline stages" },
	{ id: "healing", label: "Self-healing" },
	{ id: "observing", label: "Runs & logs" },
	{ id: "configuration", label: "Configuration" },
];

const STAGES = [
	{
		icon: "i-mdi:package-variant",
		name: "Install",
		description:
			"Resolve the workspace and install dependencies with a frozen lockfile.",
	},
	{
		icon: "i-mdi:check-all",
		name: "Lint",
		description: "Run Biome over every package and fail on diagnostics.",
	},
	{
		icon: "i-mdi:flask-outline",
		name: "Test",
		description: "Execute the test suites and collect the failing commands.",
	},
	{
		icon: "i-mdi:language-typescript",
		name: "Typecheck",
		description: "Run tsc with no emit across the monorepo.",
	},
	{
		icon: "i-mdi:hammer-wrench",
		name: "Build",
		description: "Produce the deployable bundles and upload artifacts.",
	},
];

function CiDocs() {
	return (
		<SectionLayout sections={SECTIONS} label="CI documentation">
			<div class="space-y-6">
				<section id="overview" class="scroll-mt-24">
					<Card>
						<div class="mb-1 flex items-center gap-2">
							<h2 class="text-base font-semibold text-fg">Overview</h2>
							<Badge variant="primary" size="sm">
								live
							</Badge>
						</div>
						<p class="text-sm leading-relaxed text-dim">
							CI Pipeline watches a repository and runs every push through a
							fresh sandbox. Runs are recorded in a registry; when a command
							fails, the healing agent attempts a repair before the run is
							reported as failed. The app exposes the same data the worker
							writes — overview, runs, heal attempts, logs and configuration.
						</p>
						<div class="mt-4 grid gap-2 sm:grid-cols-3">
							<DocLink
								to="/ci"
								icon="i-mdi:view-dashboard-outline"
								title="Overview"
								description="Health, recent runs and heals"
							/>
							<DocLink
								to="/ci/runs"
								icon="i-mdi:pipe"
								title="Runs"
								description="Every push and its checks"
							/>
							<DocLink
								to="/ci/logs"
								icon="i-mdi:math-log"
								title="Logs"
								description="Run and heal events in one feed"
							/>
						</div>
					</Card>
				</section>

				<section id="stages" class="scroll-mt-24">
					<Card>
						<h2 class="text-base font-semibold text-fg">Pipeline stages</h2>
						<p class="mt-1 text-sm leading-relaxed text-dim">
							Each stage runs in order. A failure stops the pipeline and hands
							the failing command to the healing agent.
						</p>
						<div class="mt-4 divide-y divide-edge">
							<For each={STAGES}>
								{(stage, index) => (
									<div class="flex items-start gap-3 py-3">
										<span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-edge text-xs tabular-nums text-dim">
											{index() + 1}
										</span>
										<span
											class={`${stage.icon} mt-0.5 shrink-0 text-lg text-acc`}
										/>
										<div class="min-w-0">
											<p class="text-sm text-fg">{stage.name}</p>
											<p class="mt-0.5 text-sm leading-relaxed text-dim">
												{stage.description}
											</p>
										</div>
									</div>
								)}
							</For>
						</div>
					</Card>
				</section>

				<section id="healing" class="scroll-mt-24">
					<Card>
						<h2 class="text-base font-semibold text-fg">Self-healing</h2>
						<div class="mt-3 space-y-3 text-sm leading-relaxed text-dim">
							<p>
								The healing agent opens a second sandbox at the failing commit,
								applies a fix and re-runs every command that failed. A run is
								marked <span class="text-warn">healed</span> only after all
								failed commands pass again.
							</p>
							<p>
								Verified fixes are pushed to a{" "}
								<code class="rounded bg-ink px-1.5 py-0.5 font-mono text-xs text-fg">
									ci-autofix/&lt;run-id&gt;
								</code>{" "}
								branch with a pull request, so a human still reviews the change.
								Unverified attempts are recorded as{" "}
								<span class="text-err">heal failed</span> and never pushed.
							</p>
							<p>
								Every attempt appears under{" "}
								<Link to="/ci/heals" class="text-acc hover:underline">
									Heal attempts
								</Link>{" "}
								with its run, status and error summary.
							</p>
						</div>
					</Card>
				</section>

				<section id="observing" class="scroll-mt-24">
					<Card>
						<h2 class="text-base font-semibold text-fg">Runs &amp; logs</h2>
						<div class="mt-3 space-y-3 text-sm leading-relaxed text-dim">
							<p>
								The{" "}
								<Link to="/ci/runs" class="text-acc hover:underline">
									Runs
								</Link>{" "}
								view lists every pipeline with its branch, commit and failed
								commands. Open a run to inspect each step and the raw output.
							</p>
							<p>
								The{" "}
								<Link to="/ci/logs" class="text-acc hover:underline">
									Logs
								</Link>{" "}
								tab merges runs and heal attempts into one filterable feed with
								levels, search, live refresh and text export.
							</p>
						</div>
					</Card>
				</section>

				<section id="configuration" class="scroll-mt-24">
					<Card>
						<h2 class="text-base font-semibold text-fg">Configuration</h2>
						<div class="mt-3 space-y-3 text-sm leading-relaxed text-dim">
							<p>
								The console talks to the worker through{" "}
								<code class="rounded bg-ink px-1.5 py-0.5 font-mono text-xs text-fg">
									/rpc
								</code>
								. Set a different base URL under{" "}
								<Link to="/ci/settings" class="text-acc hover:underline">
									Settings
								</Link>{" "}
								— it is stored in this browser and shared by every CI tab.
							</p>
							<p>
								Repository, backup bucket and healer model come from the worker
								configuration and are shown read-only in settings.
							</p>
						</div>
					</Card>
				</section>
			</div>
		</SectionLayout>
	);
}

function DocLink(props: {
	to: "/ci" | "/ci/runs" | "/ci/logs";
	icon: string;
	title: string;
	description: string;
}) {
	return (
		<Link
			to={props.to}
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
