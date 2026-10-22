/**
 * PageActions - docs-page utility row: copy markdown, edit/view source on the
 * repo, report an issue, propose a PR, or open the page in an AI chat.
 * Ported from create-docs runtime; fully prop-driven.
 */

import { useCopyToClipboard } from "@wrikka/hooks";
import { type JSX, Show, splitProps } from "solid-js";

export interface PageActionsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Raw markdown source copied to the clipboard and sent to AI chats. */
	source: string;
	/** Page title used in the AI prompt and issue title. */
	title?: string;
	/** Repo URL without trailing slash, e.g. https://github.com/org/repo. */
	repoUrl?: string;
	/** Branch for edit/blob links. @default "main" */
	branch?: string;
	/** Repo-relative file path, e.g. docs/getting-started.md. */
	filePath?: string;
	/** Which actions to render; defaults to all that have enough context. */
	show?: ("copy" | "edit" | "view" | "issue" | "pr" | "chatgpt" | "claude")[];
	/** Called after the source is copied. */
	onCopy?: () => void;
}

const btn =
	"inline-flex items-center gap-1.5 px-2.5 h-8 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer bg-transparent no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const icons: Record<string, JSX.Element> = {
	copy: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
			<rect x="9" y="9" width="12" height="12" rx="2" />
			<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
		</svg>
	),
	check: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			class="h-3.5 w-3.5 text-success"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
		</svg>
	),
	edit: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
		</svg>
	),
	eye: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
			<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	),
	bug: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
			<circle cx="12" cy="12" r="9" />
			<path stroke-linecap="round" d="M12 8v4m0 4h.01" />
		</svg>
	),
	pr: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
			<circle cx="6" cy="6" r="2.5" />
			<circle cx="6" cy="18" r="2.5" />
			<circle cx="18" cy="6" r="2.5" />
			<path stroke-linecap="round" d="M6 8.5v7M18 8.5a5 5 0 0 1-5 5h-3" />
		</svg>
	),
	ai: (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"
			/>
		</svg>
	),
};

export function PageActions(props: PageActionsProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"source",
		"title",
		"repoUrl",
		"branch",
		"filePath",
		"show",
		"onCopy",
	]);
	const { copy: copyText, copied } = useCopyToClipboard(1500);

	const branch = () => local.branch ?? "main";
	const repo = () => (local.repoUrl ?? "").replace(/\/$/, "");
	const filePath = () => local.filePath ?? "";
	const wants = (id: string) => !local.show || local.show.includes(id as never);

	const copyMarkdown = async () => {
		if (await copyText(local.source)) local.onCopy?.();
	};

	const editUrl = () => `${repo()}/edit/${branch()}/${filePath()}`;
	const viewUrl = () => `${repo()}/blob/${branch()}/${filePath()}`;
	const issueUrl = () =>
		`${repo()}/issues/new?title=${encodeURIComponent(`docs: ${local.title ?? filePath()}`)}&body=${encodeURIComponent(`Issue on page ${local.title ?? filePath()}`)}`;
	const prUrl = () =>
		`${repo()}/compare/${branch()}?quick_pull=1&title=${encodeURIComponent(`docs: ${local.title ?? ""}`)}`;

	const aiPrompt = () =>
		`Please review the following documentation page titled "${local.title ?? "this page"}" and summarize the key points, suggest improvements, and answer any questions the user may have:\n\n${local.source}`;
	const chatGptUrl = () => `https://chat.openai.com/?q=${encodeURIComponent(aiPrompt())}`;
	const claudeUrl = () => `https://claude.ai/chat?q=${encodeURIComponent(aiPrompt())}`;

	return (
		<div class={`solidui-page-actions flex items-center gap-2 flex-wrap ${local.class ?? ""}`.trim()} {...rest}>
			<Show when={wants("copy")}>
				<button type="button" onClick={copyMarkdown} class={btn}>
					{copied() ? icons.check : icons.copy}
					{copied() ? "Copied" : "Copy markdown"}
				</button>
			</Show>
			<Show when={repo() && filePath() && wants("edit")}>
				<a href={editUrl()} target="_blank" rel="noreferrer" class={btn}>
					{icons.edit}
					Edit
				</a>
			</Show>
			<Show when={repo() && filePath() && wants("view")}>
				<a href={viewUrl()} target="_blank" rel="noreferrer" class={btn}>
					{icons.eye}
					View source
				</a>
			</Show>
			<Show when={repo() && wants("issue")}>
				<a href={issueUrl()} target="_blank" rel="noreferrer" class={btn}>
					{icons.bug}
					Report issue
				</a>
			</Show>
			<Show when={repo() && wants("pr")}>
				<a href={prUrl()} target="_blank" rel="noreferrer" class={btn}>
					{icons.pr}
					Suggest PR
				</a>
			</Show>
			<Show when={wants("chatgpt")}>
				<a href={chatGptUrl()} target="_blank" rel="noreferrer" class={btn}>
					{icons.ai}
					ChatGPT
				</a>
			</Show>
			<Show when={wants("claude")}>
				<a href={claudeUrl()} target="_blank" rel="noreferrer" class={btn}>
					{icons.ai}
					Claude
				</a>
			</Show>
		</div>
	);
}
