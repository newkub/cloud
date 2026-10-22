/**
 * EmbedFrame — sandboxed embed card with a tab bar (Preview/Code/Console),
 * an iframe (or children) content area and an external-link button.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface EmbedFrameProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Card title, shown left of the tab bar. */
	title: string;
	/** Tab labels. @default ["Preview","Code","Console"] */
	tabs?: string[];
	/** Embed URL — rendered in a sandboxed iframe and used by the external-link button. */
	src?: string;
	/** Controlled active tab. */
	activeTab?: string;
	/** Called when a tab is selected. */
	onTabChange?: (tab: string) => void;
	/** Content area in px. @default 240 */
	height?: number;
	/** Custom pane content — takes precedence over the iframe. */
	children?: JSX.Element;
	/** Corner radius. */
	radius?: Radius;
}

export function EmbedFrame(props: EmbedFrameProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"tabs",
		"src",
		"activeTab",
		"onTabChange",
		"height",
		"children",
		"radius",
	]);
	const tabs = () => local.tabs ?? ["Preview", "Code", "Console"];
	const [internal, setInternal] = createSignal("");
	const active = () => local.activeTab ?? (internal() || tabs()[0]);
	const select = (t: string) => {
		setInternal(t);
		local.onTabChange?.(t);
	};

	return (
		<div
			class={`solidui-embed-frame overflow-hidden border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="flex items-center gap-2 border-b border-border px-2 py-1.5">
				<span class="truncate text-xs font-semibold text-foreground">{local.title}</span>
				<div class="ml-auto flex items-center gap-1" role="tablist" aria-label={`${local.title} views`}>
					<For each={tabs()}>
						{(t) => (
							<button
								type="button"
								role="tab"
								aria-selected={active() === t}
								class={`h-6 rounded px-2 font-mono text-2xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
									active() === t ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
								}`}
								onClick={() => select(t)}
							>
								{t}
							</button>
						)}
					</For>
				</div>
				<Show when={local.src}>
					{(s) => (
						<a
							class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							href={s()}
							target="_blank"
							rel="noreferrer"
							aria-label={`Open ${local.title} in a new tab`}
						>
							<span class="sr-only">Open in new tab</span>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="h-3.5 w-3.5"
								aria-hidden="true"
							>
								<path d="M7 17 17 7M8 7h9v9" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</a>
					)}
				</Show>
			</div>
			<div class="bg-background" role="tabpanel" style={{ height: `${local.height ?? 240}px` }}>
				<Show
					when={local.children}
					fallback={
						<Show
							when={local.src}
							fallback={
								<p class="m-0 flex h-full items-center justify-center p-4 text-xs text-muted-foreground">
									Nothing embedded — pass src or children.
								</p>
							}
						>
							{(s) => (
								<iframe
									class="h-full w-full border-0"
									src={s()}
									title={`${local.title} — ${active()}`}
									sandbox="allow-scripts allow-forms allow-same-origin"
									referrerpolicy="no-referrer"
									loading="lazy"
								/>
							)}
						</Show>
					}
				>
					{local.children}
				</Show>
			</div>
		</div>
	);
}
