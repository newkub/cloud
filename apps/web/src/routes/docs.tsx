import { createFileRoute, Link } from "@tanstack/solid-router";
import { Badge, Kbd } from "@wrikka/solid-ui";
import { For } from "solid-js";
import { Card } from "../ci/ui";
import { CloudFrame } from "../shell/CloudFrame";
import { SectionLayout } from "../shell/SectionLayout";

export const Route = createFileRoute("/docs")({ component: DocsPage });

const SECTIONS = [
	{ id: "getting-started", label: "Getting started" },
	{ id: "navigation", label: "Apps & tabs" },
	{ id: "ci-pipeline", label: "CI pipeline" },
	{ id: "products", label: "Products" },
	{ id: "configuration", label: "Configuration" },
	{ id: "shortcuts", label: "Shortcuts" },
];

const STEP_COMMANDS = [
	{ label: "Install dependencies", command: "bun install" },
	{ label: "Start the web console", command: "bun run dev" },
	{
		label: "Start the CI mock worker",
		command: "bun --filter @wrikka/cloud-ci dev:mock",
	},
];

const SHORTCUTS = [
	{ keys: ["⌘", "K"], label: "Open the command palette" },
	{ keys: ["/"], label: "Open the command palette" },
	{ keys: ["↑", "↓"], label: "Move through palette results" },
	{ keys: ["Esc"], label: "Close the palette" },
];

function DocsPage() {
	return (
		<CloudFrame>
			<SectionLayout sections={SECTIONS} label="Documentation">
				<div class="space-y-6">
					<section id="getting-started" class="scroll-mt-24">
						<Card>
							<div class="mb-1 flex items-center gap-2">
								<h2 class="text-base font-semibold text-fg">Getting started</h2>
								<Badge variant="primary" size="sm">
									guide
								</Badge>
							</div>
							<p class="text-sm leading-relaxed text-dim">
								The workspace ships as a Bun monorepo. The web console lives in{" "}
								<code class="rounded bg-ink px-1.5 py-0.5 font-mono text-xs text-fg">
									apps/web
								</code>{" "}
								and the self-healing pipeline in{" "}
								<code class="rounded bg-ink px-1.5 py-0.5 font-mono text-xs text-fg">
									apps/ci
								</code>
								.
							</p>
							<div class="mt-4 space-y-2">
								<For each={STEP_COMMANDS}>
									{(step, index) => (
										<div class="flex flex-col gap-2 rounded-lg border border-edge bg-ink px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
											<span class="flex items-center gap-3 text-sm text-fg">
												<span class="flex h-6 w-6 items-center justify-center rounded-full border border-edge text-xs tabular-nums text-dim">
													{index() + 1}
												</span>
												{step.label}
											</span>
											<code class="font-mono text-xs text-acc">
												{step.command}
											</code>
										</div>
									)}
								</For>
							</div>
						</Card>
					</section>

					<section id="navigation" class="scroll-mt-24">
						<Card>
							<h2 class="text-base font-semibold text-fg">Apps &amp; tabs</h2>
							<p class="mt-1 text-sm leading-relaxed text-dim">
								Every app — Cloud and each product — shares the same frame:{" "}
								<strong class="font-medium text-fg">App</strong>,{" "}
								<strong class="font-medium text-fg">Docs</strong>,{" "}
								<strong class="font-medium text-fg">Settings</strong> and{" "}
								<strong class="font-medium text-fg">Logs</strong> tabs sit below
								the app header. Documentation and settings open their own
								sidebar on the left of the content, and the app tab exposes
								internal views at the top.
							</p>
							<div class="mt-4 grid gap-2 sm:grid-cols-2">
								<DocLink
									to="/"
									icon="i-mdi:cloud-outline"
									title="Cloud app"
									description="Workspace overview, services and activity"
								/>
								<DocLink
									to="/products"
									icon="i-mdi:grid"
									title="All apps"
									description="Every service in one catalog"
								/>
							</div>
							<p class="mt-3 text-sm leading-relaxed text-dim">
								Press{" "}
								<code class="rounded bg-ink px-1.5 py-0.5 font-mono text-xs text-fg">
									⌘K
								</code>{" "}
								or{" "}
								<code class="rounded bg-ink px-1.5 py-0.5 font-mono text-xs text-fg">
									/
								</code>{" "}
								anywhere to jump between apps, switch tabs or toggle appearance
								from the command palette.
							</p>
						</Card>
					</section>

					<section id="ci-pipeline" class="scroll-mt-24">
						<Card>
							<div class="mb-1 flex items-center gap-2">
								<h2 class="text-base font-semibold text-fg">CI pipeline</h2>
								<Badge variant="primary" size="sm">
									live
								</Badge>
							</div>
							<p class="text-sm leading-relaxed text-dim">
								Pushes to the watched repository run install, lint, test,
								typecheck and build inside a sandbox. When a step fails, the
								healing agent opens a workspace, fixes the code, re-verifies the
								failed commands and pushes a fix branch with a pull request.
							</p>
							<div class="mt-4 grid gap-2 sm:grid-cols-3">
								<DocLink
									to="/ci"
									icon="i-mdi:view-dashboard-outline"
									title="Overview"
									description="Pipeline health at a glance"
								/>
								<DocLink
									to="/ci/runs"
									icon="i-mdi:pipe"
									title="Runs"
									description="Every push and its checks"
								/>
								<DocLink
									to="/ci/settings"
									icon="i-mdi:cog-outline"
									title="Settings"
									description="Repository and worker bindings"
								/>
							</div>
						</Card>
					</section>

					<section id="products" class="scroll-mt-24">
						<Card>
							<h2 class="text-base font-semibold text-fg">Products</h2>
							<p class="mt-1 text-sm leading-relaxed text-dim">
								Each product is its own app with the full tab set — app
								overview, documentation, settings and logs. Products marked{" "}
								<span class="text-acc">live</span> are wired to a running
								service; the rest are previews of what ships next.
							</p>
							<div class="mt-4 grid gap-2 sm:grid-cols-2">
								<DocLink
									to="/products"
									icon="i-mdi:grid"
									title="Product catalog"
									description="Every service grouped by category"
								/>
								<DocLink
									to="/ci"
									icon="i-mdi:pipe"
									title="CI Pipeline"
									description="Delivery — self-healing builds"
								/>
							</div>
						</Card>
					</section>

					<section id="configuration" class="scroll-mt-24">
						<Card>
							<h2 class="text-base font-semibold text-fg">Configuration</h2>
							<div class="mt-3 space-y-3 text-sm leading-relaxed text-dim">
								<p>
									Appearance preferences — mode, accent color and reduced motion
									— live in the Cloud app under{" "}
									<Link to="/settings" class="text-acc hover:underline">
										Settings
									</Link>{" "}
									and persist in local storage.
								</p>
								<p>
									CI requests hit{" "}
									<code class="rounded bg-ink px-1.5 py-0.5 font-mono text-xs text-fg">
										/rpc
									</code>{" "}
									by default. Vite proxies that path to{" "}
									<code class="rounded bg-ink px-1.5 py-0.5 font-mono text-xs text-fg">
										http://127.0.0.1:8787
									</code>
									. Point the console at another worker from the CI app under{" "}
									<Link to="/ci/settings" class="text-acc hover:underline">
										Settings
									</Link>
									.
								</p>
							</div>
						</Card>
					</section>

					<section id="shortcuts" class="scroll-mt-24">
						<Card>
							<h2 class="text-base font-semibold text-fg">
								Keyboard shortcuts
							</h2>
							<div class="mt-3 divide-y divide-edge">
								<For each={SHORTCUTS}>
									{(shortcut) => (
										<div class="flex items-center justify-between py-2.5 text-sm">
											<span class="text-dim">{shortcut.label}</span>
											<span class="flex gap-1">
												<For each={shortcut.keys}>
													{(key) => <Kbd>{key}</Kbd>}
												</For>
											</span>
										</div>
									)}
								</For>
							</div>
						</Card>
					</section>
				</div>
			</SectionLayout>
		</CloudFrame>
	);
}

function DocLink(props: {
	to: "/" | "/products" | "/ci" | "/ci/runs" | "/ci/settings";
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
