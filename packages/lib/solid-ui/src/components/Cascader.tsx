/**
 * Cascader — multi-level cascading select (Region → City → District).
 */
import { createMemo, createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

export interface CascaderOption {
	value: string;
	label: string;
	children?: CascaderOption[];
	disabled?: boolean;
}

export interface CascaderProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	options?: CascaderOption[];
	/** Path of selected values, e.g. ["asia","th","bkk"] (controlled). */
	value?: string[];
	/** Initial selected path (uncontrolled). */
	defaultValue?: string[];
	onChange?: (path: string[], leaf: CascaderOption) => void;
	placeholder?: string;
	/** Separator between breadcrumb labels. @default " / " */
	separator?: string;
	variant?: InputVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	disabled?: boolean;
	/** Marks the control invalid — destructive border + `data-invalid`. @default false */
	invalid?: boolean;
	/** Show a clear (×) button that empties the path. @default false */
	clearable?: boolean;
	/** Accessible label for the clear button. @default "Clear selection" */
	clearLabel?: string;
	/** Called after the path is cleared — in controlled mode reset `value` here. */
	onClear?: () => void;
	/** Label for the disabled option shown when a level has no options. @default "No options" */
	emptyText?: string;
	/** Busy state — disables all level selects and sets `data-loading`. @default false */
	loading?: boolean;
	/** Stretch each level select to the container width. @default false */
	fullWidth?: boolean;
}

const ctrl = { sm: "h-7 text-2xs", md: "h-8 text-xs", lg: "h-9 text-sm" } as const;

export function Cascader(props: CascaderProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"options",
		"value",
		"defaultValue",
		"onChange",
		"placeholder",
		"separator",
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
		"fullWidth",
	]);
	const [internal, setInternal] = createSignal<string[]>(local.defaultValue ?? []);
	const path = () => (local.value !== undefined ? local.value : internal());
	const levels = createMemo(() => {
		const out: CascaderOption[][] = [local.options ?? []];
		let nodes = local.options ?? [];
		for (const v of path()) {
			const found = nodes.find((n) => n.value === v);
			if (!found?.children?.length) break;
			out.push(found.children);
			nodes = found.children;
		}
		return out;
	});
	const labelPath = () => {
		const labels: string[] = [];
		let nodes = local.options ?? [];
		for (const v of path()) {
			const found = nodes.find((n) => n.value === v);
			if (!found) break;
			labels.push(found.label);
			nodes = found.children ?? [];
		}
		return labels.join(local.separator ?? " / ");
	};
	const pick = (level: number, raw: string) => {
		const next = [...path().slice(0, level), raw];
		let nodes = local.options ?? [];
		let leaf: CascaderOption | undefined;
		for (const v of next) {
			leaf = nodes.find((n) => n.value === v);
			nodes = leaf?.children ?? [];
		}
		if (local.value === undefined) setInternal(next);
		if (leaf) local.onChange?.(next, leaf);
	};
	const clear = () => {
		if (local.value === undefined) setInternal([]);
		local.onClear?.();
	};

	return (
		<div
			class={`solidui-cascader ${local.class ?? ""}`.trim()}
			data-invalid={local.invalid || undefined}
			data-loading={local.loading || undefined}
			data-disabled={local.disabled || undefined}
			{...rest}
		>
			<div class="flex flex-wrap items-center gap-1">
				<For each={levels()}>
					{(opts, level) => (
						<>
							<Show when={level() > 0}>
								<svg
									class="h-3 w-3 text-muted-foreground"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</Show>
							<select
								disabled={local.disabled || local.loading}
								aria-label={`Level ${level() + 1}`}
								aria-invalid={local.invalid || undefined}
								value={path()[level()] ?? ""}
								class={`border bg-surface px-2 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive disabled:opacity-50 ${local.fullWidth ? "w-full" : ""} ${inputVariants[local.variant ?? "default"]} ${ctrl[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]}`}
								onChange={(e) => pick(level(), e.currentTarget.value)}
							>
								<option value="" disabled>
									{local.placeholder ?? "Select…"}
								</option>
								<For each={opts}>
									{(o) => (
										<option value={o.value} disabled={o.disabled}>
											{o.label}
										</option>
									)}
								</For>
								<Show when={!opts.length}>
									<option value="" disabled>
										{local.emptyText ?? "No options"}
									</option>
								</Show>
							</select>
						</>
					)}
				</For>
				<Show when={local.clearable && path().length > 0 && !local.disabled && !local.loading}>
					<button
						type="button"
						aria-label={local.clearLabel ?? "Clear selection"}
						class="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						onClick={clear}
					>
						×
					</button>
				</Show>
			</div>
			<Show when={path().length}>
				<div class="mt-1 text-2xs text-muted-foreground">{labelPath()}</div>
			</Show>
		</div>
	);
}
