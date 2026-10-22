/**
 * CsvColumnMapper - assign CSV columns to target fields via selects, with required-field errors and a sample preview.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface CsvField {
	/** Stable field identifier used as the mapping key. */
	key: string;
	/** Human-readable field name. */
	label: string;
	/** Unmapped required fields show an error state. */
	required?: boolean;
}

export interface CsvColumnMapperProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** CSV column headers available for mapping. */
	columns: string[];
	/** Sample data rows — each row is aligned with `columns`. */
	sample?: string[][];
	/** Target fields to map. */
	fields: CsvField[];
	/** Controlled mapping of field key → column name. */
	value?: Record<string, string>;
	/** Uncontrolled initial mapping. */
	defaultValue?: Record<string, string>;
	/** Called with the new mapping on every change. */
	onChange?: (value: Record<string, string>) => void;
	/** Rows shown in the preview table. @default 1 */
	previewRows?: number;
	disabled?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function CsvColumnMapper(props: CsvColumnMapperProps) {
	const { className, rest: restProps } = useComponentClasses(props, {
		base: "solidui-csv-column-mapper space-y-3",
		unstyled: props.unstyled,
		axes: [{ prop: "radius", map: radiusMap, default: "md" }],
	});
	const [, rest] = splitProps(restProps, [
		"columns",
		"sample",
		"fields",
		"value",
		"defaultValue",
		"onChange",
		"previewRows",
		"disabled",
	]);
	const columns = () => props.columns ?? [];
	const fields = () => props.fields ?? [];
	const sample = () => props.sample ?? [];
	const [inner, setInner] = createSignal<Record<string, string>>(props.defaultValue ?? {});
	const mapping = () => props.value ?? inner();
	const setField = (key: string, column: string) => {
		const next = { ...mapping() };
		if (column) next[key] = column;
		else delete next[key];
		setInner(next);
		props.onChange?.(next);
	};
	const missing = (f: CsvField) => !!f.required && !mapping()[f.key];
	const colIndex = (f: CsvField) => columns().indexOf(mapping()[f.key] ?? "");
	const mappedCount = () => fields().filter((f) => mapping()[f.key]).length;
	const preview = () => sample().slice(0, Math.max(0, props.previewRows ?? 1));

	return (
		<div class={className()} {...rest}>
			<div class="space-y-2">
				<For each={fields()}>
					{(f) => (
						<div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
							<span class="w-40 shrink-0 text-xs font-medium text-foreground">
								{f.label}
								<Show when={f.required}>
									<span class="text-destructive" aria-hidden="true">
										{" "}
										*
									</span>
								</Show>
							</span>
							<select
								aria-label={`Column for ${f.label}`}
								aria-invalid={missing(f) ? true : undefined}
								disabled={props.disabled}
								class={`h-8 min-w-40 rounded-md border bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${
									missing(f) ? "border-destructive" : "border-input"
								}`}
								value={mapping()[f.key] ?? ""}
								onChange={(e) => setField(f.key, e.currentTarget.value)}
							>
								<option value="">— not mapped —</option>
								<For each={columns()}>{(c) => <option value={c}>{c}</option>}</For>
							</select>
							<Show when={missing(f)}>
								<span role="alert" class="text-2xs text-destructive">
									Required
								</span>
							</Show>
						</div>
					)}
				</For>
				<Show when={fields().length === 0}>
					<p class="text-2xs text-muted-foreground">No fields to map</p>
				</Show>
			</div>
			<p class="text-2xs text-muted-foreground">{`${mappedCount()} of ${fields().length} fields mapped`}</p>
			<Show when={preview().length > 0 && fields().length > 0}>
				<table class="w-full border-collapse text-xs">
					<thead>
						<tr>
							<For each={fields()}>
								{(f) => (
									<th class="border border-border bg-muted px-2 py-1 text-left font-medium text-muted-foreground">
										{f.label}
									</th>
								)}
							</For>
						</tr>
					</thead>
					<tbody>
						<For each={preview()}>
							{(row) => (
								<tr>
									<For each={fields()}>
										{(f) => (
											<td class="border border-border px-2 py-1 text-foreground">
												{colIndex(f) >= 0 ? (row[colIndex(f)] ?? "—") : "—"}
											</td>
										)}
									</For>
								</tr>
							)}
						</For>
					</tbody>
				</table>
			</Show>
		</div>
	);
}
