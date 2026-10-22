/**
 * Tree view with expand/collapse
 */
import { type Accessor, createContext, createSignal, type JSX, Show, splitProps, useContext } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = { ...surfaceVariants, default: "" };

interface TreeViewContextValue {
	depth: Accessor<number>;
	registerItem: (el: HTMLElement) => void;
	focusItem: (el: HTMLElement) => void;
	activeItem: Accessor<HTMLElement | undefined>;
}

const TreeViewContext = createContext<TreeViewContextValue>();

let treeItemId = 0;

export interface TreeViewProps extends JSX.HTMLAttributes<HTMLUListElement> {
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function TreeView(props: TreeViewProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "size", "children", "radius", "elevation"]);
	const parent = useContext(TreeViewContext);
	const depth = () => (parent ? parent.depth() + 1 : 0);
	const isRoot = !parent;

	const [activeItem, setActiveItem] = createSignal<HTMLElement>();
	const items = new Set<HTMLElement>();

	const registerItem = (el: HTMLElement) => {
		items.add(el);
		if (!activeItem()) {
			setActiveItem(el);
			el.tabIndex = 0;
		}
	};

	const focusItem = (el: HTMLElement) => {
		for (const item of items) item.tabIndex = -1;
		el.tabIndex = 0;
		setActiveItem(el);
		el.focus();
	};

	const onKeyDown = (e: KeyboardEvent) => {
		const target = (e.target as HTMLElement).closest('[role="treeitem"] > button, [role="treeitem"]') as HTMLElement;
		if (!target || !items.has(target)) return;
		const list = [...items].filter((el) => el.offsetParent !== null);
		const idx = list.indexOf(target);
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				if (idx < list.length - 1) focusItem(list[idx + 1]);
				break;
			case "ArrowUp":
				e.preventDefault();
				if (idx > 0) focusItem(list[idx - 1]);
				break;
			case "ArrowRight": {
				e.preventDefault();
				const expanded = target.getAttribute("aria-expanded");
				if (expanded === "false") target.click();
				else if (expanded === "true") {
					const child = list[idx + 1];
					if (child && list.indexOf(child) === idx + 1) focusItem(child);
				}
				break;
			}
			case "ArrowLeft": {
				e.preventDefault();
				const expanded = target.getAttribute("aria-expanded");
				if (expanded === "true") target.click();
				else {
					const parentLi = target.closest("li")?.parentElement?.closest("li");
					const parentBtn = parentLi?.querySelector(":scope > button") as HTMLElement | null;
					if (parentBtn) focusItem(parentBtn);
				}
				break;
			}
			case "Home":
				e.preventDefault();
				if (list.length) focusItem(list[0]);
				break;
			case "End":
				e.preventDefault();
				if (list.length) focusItem(list[list.length - 1]);
				break;
		}
	};

	const className = () =>
		[
			"list-none m-0 space-y-1",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "none"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	const contextValue: TreeViewContextValue = {
		depth,
		registerItem: parent?.registerItem ?? registerItem,
		focusItem: parent?.focusItem ?? focusItem,
		activeItem: parent?.activeItem ?? activeItem,
	};

	return (
		<TreeViewContext.Provider value={contextValue}>
			<ul class={className()} role={isRoot ? "tree" : "group"} onKeyDown={isRoot ? onKeyDown : undefined} {...rest}>
				{local.children}
			</ul>
		</TreeViewContext.Provider>
	);
}

export interface TreeItemProps extends JSX.HTMLAttributes<HTMLLIElement> {
	label: JSX.Element;
	defaultExpanded?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function TreeItem(props: TreeItemProps) {
	const [local, rest] = splitProps(props, ["class", "label", "defaultExpanded", "children", "radius", "elevation"]);
	const [expanded, setExpanded] = createSignal(local.defaultExpanded ?? false);
	const ctx = useContext(TreeViewContext);
	const hasChildren = () => !!local.children;
	const indent = () => (ctx ? ctx.depth() * 0.75 : 0);
	const id = `tree-item-${++treeItemId}`;
	const groupId = `${id}-group`;

	const onToggle = () => setExpanded(!expanded());

	const className = () =>
		[
			"space-y-1",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		// biome-ignore lint/a11y/useFocusableInteractive: roving tabindex lives on the inner button per APG tree pattern
		<li class={className()} role="treeitem" aria-level={ctx ? ctx.depth() + 1 : 1} {...rest}>
			<button
				type="button"
				id={id}
				ref={(el) => {
					el.tabIndex = -1;
					ctx?.registerItem(el);
				}}
				class="inline-flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
				onClick={onToggle}
				style={{ "padding-left": `${1 + indent()}rem` }}
				aria-expanded={hasChildren() ? expanded() : undefined}
				aria-owns={hasChildren() && expanded() ? groupId : undefined}
			>
				<Show when={hasChildren()}>
					<svg
						class={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${expanded() ? "rotate-90" : ""}`}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="m9 18 6-6-6-6" />
					</svg>
				</Show>
				<span class="text-foreground">{local.label}</span>
			</button>
			<Show when={expanded()}>
				{/* biome-ignore lint/a11y/useSemanticElements: ARIA tree group semantics required for treeitem children */}
				<ul id={groupId} class="list-none p-0 m-0 space-y-1" role="group">
					{local.children}
				</ul>
			</Show>
		</li>
	);
}
