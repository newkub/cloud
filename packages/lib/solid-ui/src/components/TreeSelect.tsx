/**
 * TreeSelect — pick from a hierarchical tree inside a dropdown-style panel.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

export interface TreeSelectNode {
	key: string;
	label: string;
	children?: TreeSelectNode[];
	disabled?: boolean;
	/** Icon rendered before the label. */
	icon?: JSX.Element;
	/** Secondary line under the label. */
	description?: string;
}

export interface TreeSelectProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "onSelect"> {
	nodes?: TreeSelectNode[];
	/** Selected node key (controlled). */
	value?: string;
	/** Initial selected node key (uncontrolled). */
	defaultValue?: string;
	onSelect?: (node: TreeSelectNode) => void;
	/** Called with the selected key and node — fires alongside `onSelect`. */
	onChange?: (key: string, node: TreeSelectNode) => void;
	placeholder?: string;
	/** Filter box. @default true */
	searchable?: boolean;
	variant?: InputVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	disabled?: boolean;
	/** Marks the control invalid — destructive border + `data-invalid`. @default false */
	invalid?: boolean;
	/** Show a clear (×) button next to the selection summary. @default false */
	clearable?: boolean;
	/** Accessible label for the clear button. @default "Clear selection" */
	clearLabel?: string;
	/** Called after the selection is cleared via the clear button. */
	onClear?: () => void;
	/** Text shown when no node matches the filter. @default "No matches" */
	emptyText?: string;
	/** Show a loading row instead of the tree. @default false */
	loading?: boolean;
	/** Text shown while `loading` is on. @default "Loading…" */
	loadingText?: string;
}

const ctrl = { sm: "h-7 text-2xs", md: "h-8 text-xs", lg: "h-9 text-sm" } as const;

function flatten(nodes: TreeSelectNode[], depth = 0): { node: TreeSelectNode; depth: number }[] {
	return nodes.flatMap((n) => [{ node: n, depth }, ...flatten(n.children ?? [], depth + 1)]);
}

export function TreeSelect(props: TreeSelectProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"nodes",
		"value",
		"defaultValue",
		"onSelect",
		"onChange",
		"placeholder",
		"searchable",
		"variant",
		"size",
		"radius",
		"disabled",
		"invalid",
		"clearable",
		"clearLabel",
		"onClear",
		"emptyText",
		"loading",
		"loadingText",
	]);
	const [q, setQ] = createSignal("");
	const [internal, setInternal] = createSignal(local.defaultValue);
	const selected = () => (local.value !== undefined ? local.value : internal());
	const flat = () => flatten(local.nodes ?? []);
	const items = () => (q() ? flat().filter((f) => f.node.label.toLowerCase().includes(q().toLowerCase())) : flat());
	const selectedLabel = () => flat().find((f) => f.node.key === selected())?.node.label;

	const select = (node: TreeSelectNode) => {
		if (node.children?.length || node.disabled || local.disabled) return;
		if (local.value === undefined) setInternal(node.key);
		local.onSelect?.(node);
		local.onChange?.(node.key, node);
	};

	const clear = () => {
		if (local.value === undefined) setInternal(undefined);
		local.onClear?.();
	};

	const onTreeKeyDown = (e: KeyboardEvent & { currentTarget: HTMLElement }) => {
		const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="treeitem"]:not([disabled])'));
		if (items.length === 0) return;
		const idx = items.indexOf(e.target as HTMLButtonElement);
		let next = -1;
		if (e.key === "ArrowDown") next = idx === -1 ? 0 : Math.min(idx + 1, items.length - 1);
		else if (e.key === "ArrowUp") next = idx === -1 ? items.length - 1 : Math.max(idx - 1, 0);
		else if (e.key === "Home") next = 0;
		else if (e.key === "End") next = items.length - 1;
		if (next === -1) return;
		e.preventDefault();
		items[next].focus();
	};

	return (
		<div
			class={`solidui-tree-select ${local.class ?? ""}`.trim()}
			data-invalid={local.invalid || undefined}
			data-loading={local.loading || undefined}
			data-disabled={local.disabled || undefined}
			{...rest}
		>
			<Show when={local.searchable ?? true}>
				<input
					type="text"
					value={q()}
					disabled={local.disabled}
					placeholder={local.placeholder ?? "Filter…"}
					aria-label="Filter options"
					aria-invalid={local.invalid || undefined}
					class={`mb-1 w-full border bg-surface px-2 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive disabled:opacity-50 ${inputVariants[local.variant ?? "default"]} ${ctrl[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]}`}
					onInput={(e) => setQ(e.currentTarget.value)}
				/>
			</Show>
			<div
				role="tree"
				aria-busy={local.loading || undefined}
				class={`max-h-48 overflow-y-auto border bg-surface p-1 ${local.invalid ? "border-destructive" : "border-border"} ${radiusMap[local.radius ?? "md"]}`}
				onKeyDown={onTreeKeyDown}
			>
				<Show
					when={!local.loading}
					fallback={
						<div class="px-2 py-3 text-center text-2xs text-muted-foreground">{local.loadingText ?? "Loading…"}</div>
					}
				>
					<For each={items()}>
						{({ node, depth }) => (
							<button
								type="button"
								role="treeitem"
								disabled={node.disabled || local.disabled}
								aria-selected={selected() === node.key}
								data-selected={selected() === node.key || undefined}
								class={`flex w-full items-center gap-1.5 rounded px-1.5 text-left motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${ctrl[local.size ?? "md"]} ${
									selected() === node.key
										? "bg-primary/10 font-medium text-primary"
										: "text-foreground hover:bg-muted/60"
								}`}
								style={{ "padding-left": `${(q() ? 0 : depth) * 14 + 6}px` }}
								onClick={() => select(node)}
							>
								<Show when={node.children?.length}>
									<svg
										class="h-3 w-3 shrink-0 text-muted-foreground"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-hidden="true"
									>
										<path
											d="M4 6a1 1 0 0 1 1-1h4l2 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6Z"
											stroke-linejoin="round"
										/>
									</svg>
								</Show>
								<Show when={node.icon}>
									<span class="inline-flex shrink-0 items-center" aria-hidden="true">
										{node.icon}
									</span>
								</Show>
								<span class="min-w-0 flex-1">
									<span class="block truncate">{node.label}</span>
									<Show when={node.description}>
										<span class="block truncate text-2xs opacity-70">{node.description}</span>
									</Show>
								</span>
							</button>
						)}
					</For>
					<Show when={!items().length}>
						<div class="px-2 py-3 text-center text-2xs text-muted-foreground">{local.emptyText ?? "No matches"}</div>
					</Show>
				</Show>
			</div>
			<Show when={selectedLabel() || (local.clearable && selected())}>
				<div class="mt-1 flex items-center gap-1 text-2xs text-muted-foreground">
					<Show when={selectedLabel()}>
						<span>
							Selected: <span class="font-medium text-foreground">{selectedLabel()}</span>
						</span>
					</Show>
					<Show when={local.clearable && selected() && !local.disabled}>
						<button
							type="button"
							aria-label={local.clearLabel ?? "Clear selection"}
							class="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							onClick={clear}
						>
							×
						</button>
					</Show>
				</div>
			</Show>
		</div>
	);
}
