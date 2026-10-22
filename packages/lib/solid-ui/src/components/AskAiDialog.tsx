/**
 * AskAiDialog - "ask AI about this page" modal. The caller supplies `onAsk`
 * (e.g. hits their backend or a data source); answers render as plain text.
 * Ported from create-docs runtime; fully prop-driven.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";

export interface AskAiDialogProps extends JSX.HTMLAttributes<HTMLDivElement> {
	open: boolean;
	onClose: () => void;
	/** Subject shown next to the title, e.g. the doc title. */
	subject?: string;
	/** Heading text. @default "Ask AI about this page" */
	title?: string;
	/** Async answer source — return the reply text or throw. */
	onAsk?: (question: string) => Promise<string>;
	placeholder?: string;
}

export function AskAiDialog(props: AskAiDialogProps) {
	const [local, rest] = splitProps(props, ["class", "open", "onClose", "subject", "title", "onAsk", "placeholder"]);
	const [question, setQuestion] = createSignal("");
	const [answer, setAnswer] = createSignal("");
	const [loading, setLoading] = createSignal(false);
	const [error, setError] = createSignal("");

	const ask = async () => {
		const q = question().trim();
		if (!q || loading() || !local.onAsk) return;
		setLoading(true);
		setError("");
		setAnswer("");
		try {
			setAnswer(await local.onAsk(q));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to get answer");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Show when={local.open}>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions: backdrop click-to-close */}
			<div
				class={`solidui-ask-ai fixed inset-0 z-modal bg-overlay/70 flex items-start justify-center pt-20 px-4 ${local.class ?? ""}`.trim()}
				onClick={(e) => {
					if (e.target === e.currentTarget) local.onClose();
				}}
				{...rest}
			>
				<div
					role="dialog"
					aria-modal="true"
					aria-label={local.title ?? "Ask AI about this page"}
					class="w-full max-w-2xl rounded-lg border border-border bg-surface shadow-2xl overflow-hidden"
				>
					<div class="flex items-center gap-2 px-4 py-3 border-b border-border">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="h-4 w-4 text-primary"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9ZM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9Z"
							/>
						</svg>
						<span class="text-sm font-semibold text-foreground">{local.title ?? "Ask AI about this page"}</span>
						<Show when={local.subject}>
							<span class="text-xs text-muted-foreground truncate">— {local.subject}</span>
						</Show>
						<button
							type="button"
							onClick={local.onClose}
							aria-label="Close"
							class="ml-auto w-8 h-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer border-none bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="h-4 w-4"
								aria-hidden="true"
							>
								<path stroke-linecap="round" d="M18 6 6 18M6 6l12 12" />
							</svg>
						</button>
					</div>
					<div class="p-4">
						<div class="flex gap-2">
							<textarea
								value={question()}
								onInput={(e) => setQuestion(e.currentTarget.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										ask();
									}
								}}
								placeholder={local.placeholder ?? "Ask a question about this document…"}
								aria-label="Question"
								rows={2}
								class="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none focus-visible:ring-1 focus-visible:ring-ring"
							/>
							<button
								type="button"
								onClick={ask}
								disabled={loading() || !question().trim() || !local.onAsk}
								class="self-end inline-flex items-center gap-1.5 px-4 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								{loading() ? (
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										class="h-3.5 w-3.5 animate-spin motion-reduce:animate-none"
										aria-hidden="true"
									>
										<path stroke-linecap="round" d="M21 12a9 9 0 1 1-6.2-8.6" />
									</svg>
								) : (
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										class="h-3.5 w-3.5"
										aria-hidden="true"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="m22 2-7 20-4-9-9-4Z" />
										<path stroke-linecap="round" d="M22 2 11 13" />
									</svg>
								)}
								{loading() ? "Asking…" : "Ask"}
							</button>
						</div>
						<Show when={error()}>
							<p class="mt-3 text-sm text-destructive" role="alert">
								{error()}
							</p>
						</Show>
						<Show when={answer()}>
							<div class="mt-4 pt-3 border-t border-border">
								<p class="text-sm text-foreground whitespace-pre-wrap leading-relaxed m-0">{answer()}</p>
							</div>
						</Show>
					</div>
				</div>
			</div>
		</Show>
	);
}
