/**
 * ExportMenu - dropdown of export formats (CSV, JSON, PDF…) for dashboards and tables.
 */
import { createSignal, For, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface ExportFormat {
	/** Format id passed to onExport. */
	id: string;
	/** Display label, e.g. "CSV (.csv)". */
	label: string;
}

export interface ExportMenuProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Formats in the menu. @default CSV/JSON/PDF */
	formats?: ExportFormat[];
	/** Called with the picked format id. */
	onExport?: (id: string) => void;
	/** Trigger label. @default "Export" */
	label?: string;
	/** Corner radius. */
	radius?: Radius;
}

const DEFAULT_FORMATS: ExportFormat[] = [
	{ id: "csv", label: "CSV (.csv)" },
	{ id: "json", label: "JSON (.json)" },
	{ id: "pdf", label: "PDF (.pdf)" },
];

export function ExportMenu(props: ExportMenuProps) {
	const [local, rest] = splitProps(props, ["class", "formats", "onExport", "label", "radius"]);
	const [open, setOpen] = createSignal(false);
	let root: HTMLDivElement | undefined;

	onMount(() => {
		const onDoc = (e: MouseEvent) => {
			if (root && !root.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		onCleanup(() => document.removeEventListener("mousedown", onDoc));
	});

	const pick = (id: string) => {
		local.onExport?.(id);
		setOpen(false);
	};

	return (
		<div ref={root} class={`solidui-export-menu relative inline-block ${local.class ?? ""}`} {...rest}>
			<button
				type="button"
				class={`inline-flex h-9 items-center gap-1.5 border border-input bg-background px-3 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "md"]}`}
				aria-haspopup="menu"
				aria-expanded={open()}
				onClick={() => setOpen((v) => !v)}
			>
				<NamedIcon name="download" class="h-4 w-4 text-muted-foreground" />
				{local.label ?? "Export"}
			</button>
			<Show when={open()}>
				<div
					class={`absolute right-0 z-popover mt-1 w-44 border border-border bg-popover p-1 shadow-lg motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${radiusMap[local.radius ?? "md"]}`}
					role="menu"
				>
					<For each={local.formats ?? DEFAULT_FORMATS}>
						{(f) => (
							<button
								type="button"
								role="menuitem"
								class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								onClick={() => pick(f.id)}
							>
								{f.label}
							</button>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
