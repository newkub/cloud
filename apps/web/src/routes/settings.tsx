import { createFileRoute, Link } from "@tanstack/solid-router";
import { Badge, Button, Select, Switch } from "@wrikka/solid-ui";
import { createSignal } from "solid-js";
import { ConnectionCard } from "../ci/ConnectionCard";
import { Card, MetaRow } from "../ci/ui";
import { type Accent, loadPrefs, type Prefs, savePrefs } from "../lib/theme";
import { CloudFrame } from "../shell/CloudFrame";
import { SectionLayout } from "../shell/SectionLayout";

const ACCENTS: { value: Accent; label: string }[] = [
	{ value: "green", label: "Emerald" },
	{ value: "blue", label: "Ocean" },
	{ value: "violet", label: "Violet" },
	{ value: "orange", label: "Amber" },
];

const SECTIONS = [
	{ id: "appearance", label: "Appearance" },
	{ id: "connection", label: "Connection" },
	{ id: "workspace", label: "Workspace" },
];

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
	const [prefs, setPrefs] = createSignal(loadPrefs());

	function update(patch: Partial<Prefs>) {
		setPrefs(savePrefs({ ...prefs(), ...patch }));
	}

	return (
		<CloudFrame>
			<SectionLayout sections={SECTIONS} label="Settings">
				<div class="space-y-4">
					<section id="appearance" class="scroll-mt-24">
						<Card>
							<div class="mb-4 flex items-center gap-2">
								<span class="i-mdi:palette-outline text-lg text-acc" />
								<h2 class="text-sm font-medium text-fg">Appearance</h2>
							</div>

							<div class="space-y-4">
								<Switch
									checked={prefs().mode === "light"}
									onChange={(on) => update({ mode: on ? "light" : "dark" })}
									label="Light appearance"
									description="Switch the console between the dark and light palettes."
								/>

								<div class="h-px bg-edge" />

								<div class="flex flex-wrap items-center justify-between gap-3">
									<div>
										<p class="text-sm text-fg">Accent color</p>
										<p class="text-xs text-faint">
											Used for primary actions, charts and highlights.
										</p>
									</div>
									<Select
										value={prefs().accent}
										onChange={(value) => update({ accent: value as Accent })}
										class="w-40"
										aria-label="Accent color"
									>
										{ACCENTS.map((accent) => (
											<option value={accent.value}>{accent.label}</option>
										))}
									</Select>
								</div>

								<div class="h-px bg-edge" />

								<Switch
									checked={prefs().reducedMotion}
									onChange={(on) => update({ reducedMotion: on })}
									label="Reduce motion"
									description="Disable page transitions and pulsing indicators."
								/>
							</div>

							<div class="mt-5 rounded-lg border border-edge bg-ink p-4">
								<p class="mb-3 text-[11px] font-medium uppercase tracking-wider text-faint">
									Preview
								</p>
								<div class="flex flex-wrap items-center gap-2">
									<Button variant="primary" size="sm">
										Primary
									</Button>
									<Button variant="secondary" size="sm">
										Secondary
									</Button>
									<Badge variant="primary">live</Badge>
									<Badge variant="outline">preview</Badge>
								</div>
							</div>
						</Card>
					</section>

					<section id="connection" class="scroll-mt-24">
						<ConnectionCard description="The Cloud app reads pipeline data through this worker. Each CI app tab shares the same endpoint." />
					</section>

					<section id="workspace" class="scroll-mt-24">
						<Card>
							<div class="mb-3 flex items-center gap-2">
								<span class="i-mdi:information-outline text-lg text-acc" />
								<h2 class="text-sm font-medium text-fg">Workspace</h2>
							</div>
							<MetaRow label="Environment">
								<span class="inline-flex items-center gap-1.5">
									<span class="h-1.5 w-1.5 rounded-full bg-acc" /> local
								</span>
							</MetaRow>
							<MetaRow label="Console version">
								<span class="font-mono">v0.1.0</span>
							</MetaRow>
							<MetaRow label="Theme">
								{prefs().mode === "dark" ? "Dark" : "Light"} · {prefs().accent}
							</MetaRow>
							<MetaRow label="Preferences">
								Stored in this browser ·{" "}
								{prefs().reducedMotion ? "reduced motion" : "full motion"}
							</MetaRow>
							<div class="pt-4">
								<Link
									to="/docs"
									class="inline-flex items-center gap-1.5 text-sm text-acc hover:underline"
								>
									<span class="i-mdi:book-open-outline" /> Read the
									documentation
								</Link>
							</div>
						</Card>
					</section>
				</div>
			</SectionLayout>
		</CloudFrame>
	);
}
