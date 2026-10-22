/**
 * CommandPreviewPanel - SolidJS component for command preview
 * Displays preview information for selected commands
 */

import { For, type JSX, Show, splitProps } from "solid-js";
import type { Command } from "../../../../types";

interface CommandPreviewPanelProps {
	command: Command | null;
	onClose?: () => void;
}

export function CommandPreviewPanel(props: CommandPreviewPanelProps) {
	const [local] = splitProps(props, ["command", "onClose"]);

	if (!local.command) {
		return null;
	}

	const { command } = local;
	const preview = command.preview;

	if (!preview) {
		return (
			<PreviewPanelShell onClose={local.onClose}>
				<CommandDetails command={command} />
				<SubcommandsList command={command} />
			</PreviewPanelShell>
		);
	}

	return (
		<PreviewPanelShell onClose={local.onClose}>
			<CommandDetails command={command} />
			<PreviewCustom preview={preview} />
			<SubcommandsList command={command} />
		</PreviewPanelShell>
	);
}

interface PreviewPanelShellProps {
	onClose?: () => void;
	children: JSX.Element;
}

function PreviewPanelShell(props: PreviewPanelShellProps) {
	return (
		<div class="command-preview-panel">
			<div class="preview-header">
				<h3 class="preview-title">Preview</h3>
				<button class="preview-close-button" onClick={props.onClose} type="button" aria-label="Close preview">
					✕
				</button>
			</div>
			<div class="preview-content">{props.children}</div>
		</div>
	);
}

function CommandDetails(props: { command: Command }) {
	const { command } = props;

	return (
		<>
			<Show when={command.icon}>
				<div class="preview-icon">{command.icon}</div>
			</Show>

			<h4 class="preview-command-label">{command.label}</h4>

			<Show when={command.description}>
				<p class="preview-description">{command.description}</p>
			</Show>

			<Show when={command.category}>
				<div class="preview-category">
					<span class="category-label">Category:</span>
					<span class="category-value">{command.category}</span>
				</div>
			</Show>

			<Show when={command.hotkey}>
				<div class="preview-hotkey">
					<span class="hotkey-label">Shortcut:</span>
					<kbd>{command.hotkey}</kbd>
				</div>
			</Show>

			<Show when={command.tags && command.tags.length > 0}>
				<div class="preview-tags">
					<span class="tags-label">Tags:</span>
					<div class="tags-list">
						<For each={command.tags}>{(tag) => <span class="tag">{tag}</span>}</For>
					</div>
				</div>
			</Show>

			<Show when={command.rating}>
				<div class="preview-rating">
					<span class="rating-label">Rating:</span>
					<div class="rating-stars">
						{"★".repeat(Math.round(command.rating ?? 0))}
						{"☆".repeat(5 - Math.round(command.rating ?? 0))}
					</div>
				</div>
			</Show>
		</>
	);
}

function PreviewCustom(props: { preview: NonNullable<Command["preview"]> }) {
	const { preview } = props;

	return (
		<div class="preview-custom">
			<Show when={preview.title}>
				<h5 class="preview-custom-title">{preview.title}</h5>
			</Show>
			<Show when={preview.type === "text"}>
				<pre class="preview-text">{preview.content}</pre>
			</Show>
			<Show when={preview.type === "image"}>
				<img src={preview.content} alt={preview.title || "Preview"} class="preview-image" />
			</Show>
			<Show when={preview.type === "component"}>
				{/* trusted: preview.content is generated internally by the command palette. */}
				<div class="preview-component" innerHTML={preview.content} />
			</Show>
		</div>
	);
}

function SubcommandsList(props: { command: Command }) {
	const { command } = props;

	return (
		<Show when={command.subcommands && command.subcommands.length > 0}>
			<div class="preview-subcommands">
				<h5 class="subcommands-title">Subcommands</h5>
				<ul class="subcommands-list">
					<For each={command.subcommands}>
						{(subcommand) => (
							<li class="subcommand-item">
								<span class="subcommand-label">{subcommand.label}</span>
								<Show when={subcommand.description}>
									<span class="subcommand-description">{subcommand.description}</span>
								</Show>
							</li>
						)}
					</For>
				</ul>
			</div>
		</Show>
	);
}
