/**
 * SchemaViewer - collapsible JSON-schema field tree with type badges and required marks.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, createUniqueId, For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

/** Minimal JSON-schema shape understood by the viewer. */
export interface JsonSchemaNode {
	/** JSON-schema type — a single type or a union list. */
	type?: string | string[];
	/** Human-readable field description. */
	description?: string;
	/** Nested fields — present on `object` nodes. */
	properties?: Record<string, JsonSchemaNode>;
	/** Element schema — present on `array` nodes. */
	items?: JsonSchemaNode;
	/** Names of required child properties. */
	required?: string[];
	/** Allowed literal values. */
	enum?: unknown[];
}

const typeOf = (node: JsonSchemaNode): string => {
	if (node.type) {
		const t = Array.isArray(node.type) ? node.type.join(" | ") : node.type;
		if (t === "array" && node.items) return `array<${typeOf(node.items)}>`;
		return t;
	}
	if (node.properties) return "object";
	if (node.enum) return "enum";
	return "any";
};

interface SchemaFieldProps {
	name: string;
	node: JsonSchemaNode;
	required?: boolean;
	depth: number;
	defaultOpen?: boolean;
}

function SchemaField(props: SchemaFieldProps) {
	const children = () => Object.entries(props.node.properties ?? {});
	const expandable = () => children().length > 0 || props.node.items !== undefined;
	const [open, setOpen] = createSignal(props.defaultOpen ?? false);
	const id = `schema-field-${createUniqueId()}`;
	const requiredSet = () => new Set(props.node.required ?? []);

	const label = (
		<>
			<span class="font-mono text-foreground">{props.name}</span>
			<Show when={props.required}>
				<span class="text-destructive" title="required">
					*
				</span>
			</Show>
			<span class="rounded bg-muted px-1.5 py-0.5 text-2xs font-medium text-muted-foreground">
				{typeOf(props.node)}
			</span>
		</>
	);

	return (
		<li>
			<Show when={expandable()} fallback={<div class="flex items-center gap-2 py-1">{label}</div>}>
				<button
					type="button"
					id={`${id}-trigger`}
					class="flex w-full items-center gap-2 rounded-sm py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					aria-expanded={open()}
					aria-controls={open() ? `${id}-children` : undefined}
					onClick={() => setOpen((v) => !v)}
				>
					<svg
						class={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${open() ? "rotate-90" : ""}`}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path d="m9 18 6-6-6-6" />
					</svg>
					{label}
				</button>
			</Show>
			<Show when={props.node.description}>
				<p class={`text-xs text-muted-foreground ${expandable() ? "pl-5.5" : ""}`}>{props.node.description}</p>
			</Show>
			<Show when={expandable() && open()}>
				<ul id={`${id}-children`} class="ml-2 border-l border-border pl-3" aria-labelledby={`${id}-trigger`}>
					<For each={children()}>
						{([childName, child]) => (
							<SchemaField
								name={childName}
								node={child}
								required={requiredSet().has(childName)}
								depth={props.depth + 1}
								defaultOpen={props.defaultOpen}
							/>
						)}
					</For>
					<Show when={props.node.items && children().length === 0}>
						<SchemaField
							name="items"
							node={props.node.items ?? {}}
							depth={props.depth + 1}
							defaultOpen={props.defaultOpen}
						/>
					</Show>
				</ul>
			</Show>
		</li>
	);
}

export interface SchemaViewerProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Root JSON-schema object. */
	schema: JsonSchemaNode;
	/** Heading above the tree. @default "Schema" */
	title?: string;
	/** Expand every nested node on mount. @default false */
	defaultOpen?: boolean;
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function SchemaViewer(props: SchemaViewerProps) {
	const [local, pass] = splitProps(props, ["schema", "title", "defaultOpen"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "solidui-schema-viewer w-full p-4 text-sm",
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const fields = () => Object.entries(local.schema?.properties ?? {});
	const requiredSet = () => new Set(local.schema?.required ?? []);

	return (
		<div class={className()} {...rest}>
			<h3 class="mb-2 text-sm font-semibold text-foreground">{local.title ?? "Schema"}</h3>
			<Show when={local.schema?.description}>
				<p class="mb-2 text-xs text-muted-foreground">{local.schema.description}</p>
			</Show>
			<Show when={fields().length > 0} fallback={<p class="text-xs text-muted-foreground">No fields.</p>}>
				<ul>
					<For each={fields()}>
						{([name, node]) => (
							<SchemaField
								name={name}
								node={node}
								required={requiredSet().has(name)}
								depth={0}
								defaultOpen={local.defaultOpen}
							/>
						)}
					</For>
				</ul>
			</Show>
		</div>
	);
}
