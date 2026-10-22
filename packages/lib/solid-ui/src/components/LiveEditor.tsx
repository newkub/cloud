import { markdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { createSignal, For, onCleanup, onMount, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { Markdown } from "./Markdown";

export type LiveEditorMode = "preview" | "edit" | "split";

export interface LiveEditorGitStatus {
	branch: string;
	hasChanges: boolean;
}

export interface LiveEditorCommitOptions {
	message: string;
	author?: string;
	email?: string;
}

export interface LiveEditorProps {
	/** Initial markdown content. */
	content: string;
	/** Initial editor mode (default "split"). */
	mode?: LiveEditorMode;
	/** Git status chip shown in the toolbar. */
	gitStatus?: LiveEditorGitStatus;
	/** Show the commit message input + Commit/Push actions. */
	git?: boolean;
	onSave?: (content: string) => Promise<void> | void;
	onCommit?: (options: LiveEditorCommitOptions) => Promise<void> | void;
	onPush?: () => Promise<void> | void;
	onChange?: (content: string) => void;
	class?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const MODES: { id: LiveEditorMode; label: string }[] = [
	{ id: "preview", label: "Preview" },
	{ id: "edit", label: "Edit" },
	{ id: "split", label: "Split" },
];

/**
 * LiveEditor — markdown editor with preview/edit/split modes backed by
 * CodeMirror, plus optional Save/Commit/Push git actions.
 */
export function LiveEditor(props: LiveEditorProps) {
	const [local] = splitProps(props, [
		"content",
		"mode",
		"gitStatus",
		"git",
		"onSave",
		"onCommit",
		"onPush",
		"onChange",
		"class",
	]);
	const [mode, setMode] = createSignal<LiveEditorMode>(local.mode ?? "split");
	const [content, setContent] = createSignal(local.content);
	const [busy, setBusy] = createSignal<"save" | "commit" | "push" | null>(null);
	let editorHost: HTMLDivElement | undefined;
	let commitInput: HTMLInputElement | undefined;
	let view: EditorView | undefined;

	const syncEditor = (value: string) => {
		setContent(value);
		local.onChange?.(value);
	};

	onMount(() => {
		if (!editorHost) return;
		view = new EditorView({
			parent: editorHost,
			state: EditorState.create({
				doc: content(),
				extensions: [
					basicSetup,
					markdown(),
					EditorView.updateListener.of((u) => {
						if (u.docChanged) syncEditor(u.state.doc.toString());
					}),
					EditorView.theme({
						"&": { height: "100%", fontSize: "0.8125rem" },
						".cm-scroller": { fontFamily: "ui-monospace, monospace", overflow: "auto" },
						".cm-content": { padding: "12px 0" },
						".cm-gutters": { border: "none" },
					}),
				],
			}),
		});
	});

	onCleanup(() => view?.destroy());

	const run = async (kind: "save" | "commit" | "push") => {
		if (busy()) return;
		setBusy(kind);
		try {
			if (kind === "save") await local.onSave?.(content());
			if (kind === "commit") {
				const message = commitInput?.value.trim();
				if (message) {
					await local.onCommit?.({ message });
					if (commitInput) commitInput.value = "";
				}
			}
			if (kind === "push") await local.onPush?.();
		} finally {
			setBusy(null);
		}
	};

	const actionBtn =
		"inline-flex h-8 items-center rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50";

	return (
		<div
			class={`flex flex-col overflow-hidden border border-border bg-surface ${radiusMap[props.radius ?? "xl"]} ${props.elevation ? elevationMap[props.elevation] : ""} ${local.class ?? ""}`}
		>
			{/* Toolbar */}
			<div class="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
				<div class="flex items-center gap-1 rounded-lg bg-muted p-0.5" role="tablist" aria-label="Editor mode">
					<For each={MODES}>
						{(m) => (
							<button
								type="button"
								role="tab"
								aria-selected={mode() === m.id}
								class={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
									mode() === m.id
										? "bg-surface text-foreground shadow-sm"
										: "text-muted-foreground hover:text-foreground"
								}`}
								onClick={() => setMode(m.id)}
							>
								{m.label}
							</button>
						)}
					</For>
				</div>
				<div class="flex items-center gap-2">
					<Show when={local.gitStatus}>
						{(s) => (
							<span class="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-mono text-2xs text-muted-foreground">
								<svg
									width="10"
									height="10"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<path d="M6 3v12m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0a9 9 0 0 1-9 9" />
								</svg>
								{s().branch}
								<Show when={s().hasChanges}>
									<span class="text-warning">●</span>
								</Show>
							</span>
						)}
					</Show>
					<Show when={local.onSave}>
						<button
							type="button"
							class={`${actionBtn} bg-primary text-primary-foreground hover:bg-primary-hover`}
							disabled={busy() === "save"}
							onClick={() => run("save")}
						>
							{busy() === "save" ? "Saving…" : "Save"}
						</button>
					</Show>
				</div>
			</div>

			{/* Commit row */}
			<Show when={local.git && (local.onCommit || local.onPush)}>
				<div class="flex items-center gap-2 border-b border-border px-3 py-2">
					<input
						ref={commitInput}
						type="text"
						placeholder="Commit message…"
						class="h-8 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					/>
					<Show when={local.onCommit}>
						<button
							type="button"
							class={`${actionBtn} border border-border text-foreground hover:bg-muted`}
							disabled={busy() === "commit"}
							onClick={() => run("commit")}
						>
							{busy() === "commit" ? "Committing…" : "Commit"}
						</button>
					</Show>
					<Show when={local.onPush}>
						<button
							type="button"
							class={`${actionBtn} border border-border text-foreground hover:bg-muted`}
							disabled={busy() === "push"}
							onClick={() => run("push")}
						>
							{busy() === "push" ? "Pushing…" : "Push"}
						</button>
					</Show>
				</div>
			</Show>

			{/* Content */}
			<div class={`grid min-h-[24rem] ${mode() === "split" ? "sm:grid-cols-2" : "grid-cols-1"}`}>
				<Show when={mode() !== "preview"}>
					<div
						ref={editorHost}
						class={`max-h-[36rem] min-h-[24rem] border-border ${mode() === "split" ? "border-b sm:border-b-0 sm:border-r" : ""}`}
					/>
				</Show>
				<Show when={mode() !== "edit"}>
					<div class="markdown-preview max-h-[36rem] min-h-[24rem] overflow-y-auto px-5 py-4 text-sm">
						<Markdown content={content()} />
					</div>
				</Show>
			</div>
		</div>
	);
}
