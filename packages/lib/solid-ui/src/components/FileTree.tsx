/**
 * FileTree — file explorer tree with folder/file icons, git-status dots and expand/collapse.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";

export interface FileNode {
	name: string;
	type: "file" | "folder";
	children?: FileNode[];
	/** Git-style status marker. */
	status?: "modified" | "added" | "deleted" | "untracked";
	/** Custom icon element — overrides the default glyph. */
	icon?: JSX.Element;
}

export interface FileTreeProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	nodes: FileNode[];
	onSelect?: (node: FileNode) => void;
	/** Node name (path-leaf) rendered as active. */
	activeName?: string;
	/** Folders expanded by default. @default true */
	defaultExpanded?: boolean;
	/** Show colored git status dot. @default true */
	showStatus?: boolean;
	size?: "sm" | "md" | "lg";
}

const rowSize = { sm: "text-2xs py-0.5", md: "text-xs py-1", lg: "text-sm py-1.5" } as const;
const statusColor = {
	modified: "bg-warning",
	added: "bg-success",
	deleted: "bg-destructive",
	untracked: "bg-info",
} as const;

export function FileTree(props: FileTreeProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"nodes",
		"onSelect",
		"activeName",
		"showStatus",
		"defaultExpanded",
		"size",
	]);
	const [collapsed, setCollapsed] = createSignal(new Set<string>());
	const isOpen = (key: string) => (!(local.defaultExpanded ?? true) ? collapsed().has(key) : !collapsed().has(key));
	const toggle = (key: string) =>
		setCollapsed((s) => {
			const next = new Set(s);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});

	const glyph = (node: FileNode, open: boolean) =>
		node.icon ?? (
			<svg
				class="h-3.5 w-3.5 shrink-0"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				aria-hidden="true"
			>
				{node.type === "folder" ? (
					open ? (
						<path
							d="m6 9 6 6 6-6"
							stroke-linecap="round"
							stroke-linejoin="round"
							transform="translate(0 -2) scale(0.6) translate(8 6)"
						/>
					) : (
						<path
							d="M4 6a1 1 0 0 1 1-1h4l2 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6Z"
							stroke-linejoin="round"
						/>
					)
				) : (
					<path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" stroke-linejoin="round" />
				)}
			</svg>
		);

	const renderNode = (node: FileNode, depth: number, path: string): JSX.Element => {
		const key = `${path}/${node.name}`;
		const open = () => isOpen(key);
		return (
			<li role="none">
				<button
					type="button"
					role="treeitem"
					class={`flex w-full items-center gap-1.5 rounded px-1 text-left motion-safe:transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${rowSize[local.size ?? "md"]} ${
						local.activeName === node.name ? "bg-primary/10 text-primary" : "text-foreground"
					}`}
					style={{ "padding-left": `${depth * 14 + 4}px` }}
					aria-expanded={node.type === "folder" ? open() : undefined}
					aria-selected={local.activeName === node.name}
					onClick={() => (node.type === "folder" ? toggle(key) : local.onSelect?.(node))}
				>
					<span class="text-muted-foreground">{glyph(node, open())}</span>
					<span class="truncate">{node.name}</span>
					<Show when={(local.showStatus ?? true) && node.status}>
						<span
							class={`ml-auto h-1.5 w-1.5 shrink-0 rounded-full ${statusColor[node.status ?? "modified"]}`}
							aria-hidden="true"
						/>
						<span class="sr-only">{node.status}</span>
					</Show>
				</button>
				<Show when={node.type === "folder" && open()}>
					{/* biome-ignore lint/a11y/useSemanticElements: ARIA tree pattern — group of child treeitems */}
					<ul role="group">
						<For each={node.children}>{(child) => renderNode(child, depth + 1, key)}</For>
					</ul>
				</Show>
			</li>
		);
	};

	return (
		<div class={`solidui-file-tree ${local.class ?? ""}`.trim()} {...rest}>
			{/* biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: ARIA tree widget — children are interactive treeitems */}
			<ul role="tree">
				<For each={local.nodes}>{(n) => renderNode(n, 0, "")}</For>
			</ul>
		</div>
	);
}
