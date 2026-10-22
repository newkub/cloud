/**
 * FieldMapper - map source fields to target fields by clicking a source then a target; draws SVG connections.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface FieldMapperProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Source field names (left column). */
	source: string[];
	/** Target field names (right column). */
	target: string[];
	/** Controlled mapping of source field → target field. */
	value?: Record<string, string>;
	/** Uncontrolled initial mapping. */
	defaultValue?: Record<string, string>;
	/** Called with the new mapping on every change. */
	onChange?: (value: Record<string, string>) => void;
	/** Heading above the source column. @default "Source" */
	sourceLabel?: string;
	/** Heading above the target column. @default "Target" */
	targetLabel?: string;
	disabled?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const ROW = 40;
const ROW_H = 36;

export function FieldMapper(props: FieldMapperProps) {
	const { className, rest: restProps } = useComponentClasses(props, {
		base: "solidui-field-mapper",
		unstyled: props.unstyled,
		axes: [{ prop: "radius", map: radiusMap, default: "md" }],
	});
	const [, rest] = splitProps(restProps, [
		"source",
		"target",
		"value",
		"defaultValue",
		"onChange",
		"sourceLabel",
		"targetLabel",
		"disabled",
	]);
	const source = () => props.source ?? [];
	const target = () => props.target ?? [];
	const [inner, setInner] = createSignal<Record<string, string>>(props.defaultValue ?? {});
	const [selected, setSelected] = createSignal<string | null>(null);
	const mapping = () => props.value ?? inner();
	const sourceFor = () => {
		const inv: Record<string, string> = {};
		for (const [s, t] of Object.entries(mapping())) inv[t] = s;
		return inv;
	};
	const set = (v: Record<string, string>) => {
		setInner(v);
		props.onChange?.(v);
	};
	const unmap = (s: string) => {
		const next = { ...mapping() };
		delete next[s];
		set(next);
	};
	const clickSource = (s: string) => {
		if (props.disabled) return;
		setSelected(selected() === s ? null : s);
	};
	const clickTarget = (t: string) => {
		if (props.disabled) return;
		const sel = selected();
		if (sel) {
			const next = { ...mapping() };
			for (const k of Object.keys(next)) if (next[k] === t) delete next[k];
			next[sel] = t;
			setSelected(null);
			set(next);
			return;
		}
		const s = sourceFor()[t];
		if (s) unmap(s);
	};
	const rows = () => Math.max(source().length, target().length, 1);
	const connections = () =>
		Object.entries(mapping()).flatMap(([s, t]) => {
			const si = source().indexOf(s);
			const ti = target().indexOf(t);
			return si < 0 || ti < 0 ? [] : [{ s, t, y1: si * ROW + ROW_H / 2, y2: ti * ROW + ROW_H / 2 }];
		});
	const itemCls = (active: boolean, mapped: boolean) =>
		`flex h-9 items-center justify-between gap-1 rounded-md border px-2 text-left text-xs transition-colors disabled:opacity-50 ${
			active
				? "border-primary bg-primary/10 text-primary"
				: mapped
					? "border-primary/40 bg-primary/5 text-foreground"
					: "border-border bg-background text-foreground hover:bg-muted"
		}`;

	return (
		<div class={className()} {...rest}>
			<div class="grid grid-cols-[1fr_3rem_1fr] gap-x-1">
				<p class="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
					{props.sourceLabel ?? "Source"}
				</p>
				<span />
				<p class="text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
					{props.targetLabel ?? "Target"}
				</p>
			</div>
			<div class="mt-1 grid grid-cols-[1fr_3rem_1fr] gap-x-1">
				<div class="flex flex-col gap-1">
					<Show when={source().length === 0}>
						<span class="text-2xs text-muted-foreground">No source fields</span>
					</Show>
					<For each={source()}>
						{(s) => (
							<button
								type="button"
								disabled={props.disabled}
								aria-pressed={selected() === s}
								class={itemCls(selected() === s, !!mapping()[s])}
								onClick={() => clickSource(s)}
							>
								<span class="truncate">{s}</span>
								<Show when={mapping()[s]}>
									<span class="shrink-0 text-2xs text-muted-foreground">{`→ ${mapping()[s]}`}</span>
								</Show>
							</button>
						)}
					</For>
				</div>
				<svg
					viewBox={`0 0 100 ${rows() * ROW - (ROW - ROW_H)}`}
					preserveAspectRatio="none"
					class="h-full w-full"
					aria-hidden="true"
				>
					<For each={connections()}>
						{(c) => (
							<line
								x1={0}
								y1={c.y1}
								x2={100}
								y2={c.y2}
								class="stroke-primary"
								stroke-width="2"
								data-source={c.s}
								data-target={c.t}
							/>
						)}
					</For>
				</svg>
				<div class="flex flex-col gap-1">
					<Show when={target().length === 0}>
						<span class="text-2xs text-muted-foreground">No target fields</span>
					</Show>
					<For each={target()}>
						{(t) => (
							<button
								type="button"
								disabled={props.disabled}
								aria-label={sourceFor()[t] ? `Unmap ${t}` : undefined}
								class={itemCls(false, !!sourceFor()[t])}
								onClick={() => clickTarget(t)}
							>
								<Show when={sourceFor()[t]}>
									<span class="shrink-0 text-2xs text-muted-foreground">{`${sourceFor()[t]} →`}</span>
								</Show>
								<span class="truncate">{t}</span>
							</button>
						)}
					</For>
				</div>
			</div>
			<p class="mt-2 text-2xs text-muted-foreground">
				{`${Object.keys(mapping()).length} of ${source().length} fields mapped`}
			</p>
		</div>
	);
}
