/**
 * SiteMap — nested link tree with expand/collapse toggles and depth-aware icons.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";

export interface SiteMapNode {
	/** Node label. */
	label: string;
	/** Link target — renders an anchor when provided. */
	href?: string;
	/** Custom icon — overrides the default folder/page glyph. */
	icon?: JSX.Element;
	/** Nested nodes — makes the node expandable. */
	children?: SiteMapNode[];
}

export interface SiteMapProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Tree of nodes to render. */
	nodes: SiteMapNode[];
	/** Start with all branches expanded. @default true */
	defaultExpanded?: boolean;
	/** Called when a linked node is clicked. */
	onNavigate?: (node: SiteMapNode) => void;
}

const depthPad = ["pl-0", "pl-4", "pl-4", "pl-4", "pl-4", "pl-4"] as const;

function FolderIcon() {
	return (
		<svg
			class="h-4 w-4 shrink-0 text-muted-foreground"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
		</svg>
	);
}

function PageIcon() {
	return (
		<svg
			class="h-4 w-4 shrink-0 text-muted-foreground"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
			<path d="M14 2v4a2 2 0 0 0 2 2h4" />
		</svg>
	);
}

export function SiteMap(props: SiteMapProps) {
	const [local, rest] = splitProps(props, ["class", "nodes", "defaultExpanded", "onNavigate"]);
	const [collapsedMap, setCollapsedMap] = createSignal<Record<string, boolean>>({});
	const isOpen = (key: string) => {
		const base = local.defaultExpanded ?? true;
		const flip = collapsedMap()[key] ?? false;
		return flip ? !base : base;
	};
	const toggle = (key: string) => setCollapsedMap((m) => ({ ...m, [key]: !(m[key] ?? false) }));

	const chevron = (open: boolean) => (
		<svg
			class={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path d="m9 6 6 6-6 6" />
		</svg>
	);

	const rowCls =
		"inline-flex items-center gap-1.5 rounded-md py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

	const renderNode = (node: SiteMapNode, key: string, depth: number): JSX.Element => {
		const kids = () => node.children ?? [];
		const open = () => isOpen(key);
		return (
			<li class={depthPad[Math.min(depth, depthPad.length - 1)]}>
				<div class="flex items-center gap-1">
					<Show when={kids().length > 0} fallback={<span class="inline-block w-5" aria-hidden="true" />}>
						<button
							type="button"
							class="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							aria-expanded={open()}
							aria-label={open() ? `Collapse ${node.label}` : `Expand ${node.label}`}
							onClick={() => toggle(key)}
						>
							{chevron(open())}
						</button>
					</Show>
					<span
						class="inline-flex h-4 w-4 shrink-0 items-center justify-center"
						aria-hidden={node.icon ? "true" : undefined}
					>
						{node.icon ?? (kids().length > 0 ? <FolderIcon /> : <PageIcon />)}
					</span>
					{node.href ? (
						<a
							href={node.href}
							class={`${rowCls} text-foreground underline-offset-4 hover:text-primary hover:underline`}
							onClick={() => local.onNavigate?.(node)}
						>
							{node.label}
						</a>
					) : (
						<span class={`${rowCls} text-foreground`}>{node.label}</span>
					)}
				</div>
				<Show when={kids().length > 0 && open()}>
					<ul class="mt-0.5 space-y-0.5 border-l border-border">
						<For each={kids()}>{(child, i) => renderNode(child, `${key}.${i()}`, depth + 1)}</For>
					</ul>
				</Show>
			</li>
		);
	};

	return (
		<nav aria-label="Site map" class={`solidui-site-map ${local.class ?? ""}`.trim()} {...rest}>
			<ul class="space-y-0.5">
				<For each={local.nodes ?? []}>{(node, i) => renderNode(node, `${i()}`, 0)}</For>
			</ul>
		</nav>
	);
}
