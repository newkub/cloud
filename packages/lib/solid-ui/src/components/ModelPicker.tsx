/**
 * ModelPicker - dropdown for choosing an AI model with capability hints.
 */
import { createSignal, For, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface ModelOption {
	/** Model id. */
	id: string;
	/** Display name. */
	label: string;
	/** Short capability hint, e.g. "fast" or "reasoning". */
	hint?: string;
}

export interface ModelPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Models to list. */
	models?: ModelOption[];
	/** Active model id. */
	value?: string;
	/** Called with the picked model id. */
	onSelect?: (id: string) => void;
	/** Corner radius. */
	radius?: Radius;
}

export function ModelPicker(props: ModelPickerProps) {
	const [local, rest] = splitProps(props, ["class", "models", "value", "onSelect", "radius"]);
	const [open, setOpen] = createSignal(false);
	let root: HTMLDivElement | undefined;

	onMount(() => {
		const onDoc = (e: MouseEvent) => {
			if (root && !root.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		onCleanup(() => document.removeEventListener("mousedown", onDoc));
	});

	const current = () => (local.models ?? []).find((m) => m.id === local.value) ?? (local.models ?? [])[0];

	return (
		<div ref={root} class={`solidui-model-picker relative inline-block ${local.class ?? ""}`} {...rest}>
			<button
				type="button"
				class={`inline-flex h-8 items-center gap-1.5 border border-input bg-background px-2.5 text-xs font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "md"]}`}
				aria-haspopup="listbox"
				aria-expanded={open()}
				onClick={() => setOpen((v) => !v)}
			>
				<NamedIcon name="sparkles" class="h-3.5 w-3.5 text-muted-foreground" />
				{current()?.label ?? "Model"}
				<NamedIcon name="chevron-down" class="h-3 w-3 text-muted-foreground" />
			</button>
			<Show when={open()}>
				<div
					class={`absolute left-0 z-popover mt-1 w-56 border border-border bg-popover p-1 shadow-lg motion-safe:animate-[su-fade-in_var(--su-transition-fast)] ${radiusMap[local.radius ?? "md"]}`}
					role="listbox"
				>
					<For each={local.models ?? []}>
						{(m) => (
							<div
								role="option"
								tabIndex={0}
								aria-selected={m.id === local.value}
								class={`flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${m.id === local.value ? "bg-accent" : ""}`}
								onClick={() => {
									local.onSelect?.(m.id);
									setOpen(false);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										local.onSelect?.(m.id);
										setOpen(false);
									}
								}}
							>
								<span class="flex-1 truncate">{m.label}</span>
								{m.hint ? <span class="text-[10px] text-muted-foreground">{m.hint}</span> : null}
							</div>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
