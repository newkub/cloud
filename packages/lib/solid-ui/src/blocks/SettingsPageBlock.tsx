/**
 * SettingsPageBlock — settings shell: section navigation on the left, active section on the right, save bar when dirty.
 */
import { createSignal, For, Show, type JSX } from "solid-js";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { SettingsSection, type SettingsRow } from "../components/SettingsSection";

export interface SettingsNavItem {
	/** Stable section id. */
	id: string;
	/** Nav label. */
	label: string;
	/** Optional nav helper text. */
	description?: string;
	/** Rows rendered for this section. */
	rows: SettingsRow[];
}

export interface SettingsPageBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Page heading @default "Settings" */
	title?: string;
	/** Page description. */
	description?: string;
	/** Sections — the first one is active by default. */
	sections: SettingsNavItem[];
	/** Controlled active section id. */
	value?: string;
	/** Called when the active section changes. */
	onValueChange?: (id: string) => void;
	/** Show the save bar — the consumer decides when edits are pending. @default false */
	dirty?: boolean;
	/** Disables the save action while a request is running. */
	saving?: boolean;
	/** Called when the save action is triggered. */
	onSave?: () => void | Promise<void>;
	/** Called when pending edits are discarded. */
	onDiscard?: () => void;
}

export function SettingsPageBlock(props: SettingsPageBlockProps) {
	const [internal, setInternal] = createSignal(props.sections[0]?.id ?? "");
	const activeId = () => props.value ?? internal();
	const activeSection = () => props.sections.find((section) => section.id === activeId()) ?? props.sections[0];

	const select = (id: string) => {
		setInternal(id);
		props.onValueChange?.(id);
	};

	return (
		<div class={props.class}>
			<header class="mb-5">
				<h2 class="text-lg font-semibold text-foreground">{props.title ?? "Settings"}</h2>
				<Show when={props.description}>
					<p class="mt-1 text-xs text-muted-foreground">{props.description}</p>
				</Show>
			</header>

			<div class="grid gap-6 lg:grid-cols-[220px_1fr]">
				<nav aria-label="Settings sections" class="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
					<For each={props.sections}>
						{(section) => (
							<Button
								type="button"
								variant={section.id === activeId() ? "secondary" : "ghost"}
								size="sm"
								class="shrink-0 justify-start lg:w-full"
								aria-current={section.id === activeId() ? "page" : undefined}
								onClick={() => select(section.id)}
							>
								{section.label}
							</Button>
						)}
					</For>
				</nav>

				<div class="min-w-0">
					<Show when={activeSection()}>
						{(section) => (
							<SettingsSection
								title={section().label}
								description={section().description}
								rows={section().rows}
							/>
						)}
					</Show>
				</div>
			</div>

			<Show when={props.dirty}>
				<Card variant="elevated" class="mt-4 lg:ml-[244px]">
					<CardContent class="flex flex-wrap items-center justify-between gap-3 py-3">
						<p class="text-xs text-muted-foreground">You have unsaved changes.</p>
						<div class="flex gap-2">
							<Button type="button" variant="ghost" size="sm" onClick={props.onDiscard}>
								Discard
							</Button>
							<Button
								type="button"
								variant="primary"
								size="sm"
								disabled={props.saving}
								onClick={() => void props.onSave?.()}
							>
								{props.saving ? "Saving…" : "Save changes"}
							</Button>
						</div>
					</CardContent>
				</Card>
			</Show>
		</div>
	);
}
