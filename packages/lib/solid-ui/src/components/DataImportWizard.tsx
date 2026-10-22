/**
 * DataImportWizard - four-step CSV import flow: Upload → Map → Preview → Confirm.
 * Types live in `./data-import-wizard/types`, CSV parsing in
 * `./data-import-wizard/csv`, the step indicator in `./data-import-wizard/StepsNav`.
 */

import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, For, Show, splitProps } from "solid-js";
import { elevationMap, radiusMap, surfaceVariants } from "../lib/variants";
import { CsvColumnMapper, type CsvField } from "./CsvColumnMapper";
import { PREVIEW_ROWS, pad, STEPS } from "./data-import-wizard/constants";
import { parseCsv } from "./data-import-wizard/csv";
import { StepsNav } from "./data-import-wizard/StepsNav";
import type { CsvData, DataImportWizardProps } from "./data-import-wizard/types";

export type { CsvData, DataImportWizardProps, ImportResult } from "./data-import-wizard/types";

export function DataImportWizard(props: DataImportWizardProps) {
	const { className, rest: restProps } = useComponentClasses(props, {
		base: "solidui-data-import-wizard",
		unstyled: props.unstyled,
		variants: surfaceVariants,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	const [, rest] = splitProps(restProps, ["fields", "csv", "onComplete", "onStepChange", "labels"]);
	const fields = () => props.fields ?? [];
	const [step, setStep] = createSignal(0);
	const [file, setFile] = createSignal<(CsvData & { name: string }) | null>(null);
	const [mapping, setMapping] = createSignal<Record<string, string>>({});
	const columns = () => file()?.columns ?? props.csv?.columns ?? [];
	const rows = () => file()?.rows ?? props.csv?.rows ?? [];
	const labels = () => ({ back: "Back", next: "Next", finish: "Import", ...props.labels });
	const last = () => step() === STEPS.length - 1;
	const requiredMapped = () => fields().every((f) => !f.required || mapping()[f.key]);
	const canNext = () => {
		const s = step();
		if (s === 0) return columns().length > 0;
		if (s === 1) return columns().length > 0 && requiredMapped();
		return true;
	};
	const colIndex = (f: CsvField) => columns().indexOf(mapping()[f.key] ?? "");

	const readFile = (f: File) => {
		const reader = new FileReader();
		reader.onload = () => setFile({ name: f.name, ...parseCsv(String(reader.result ?? "")) });
		reader.readAsText(f);
	};
	const go = (dir: 1 | -1) => {
		if (dir === 1 && last()) {
			props.onComplete?.({ fileName: file()?.name, columns: columns(), rows: rows(), mapping: mapping() });
			return;
		}
		const next = Math.min(Math.max(0, step() + dir), STEPS.length - 1);
		setStep(next);
		props.onStepChange?.(next);
	};
	const jump = (i: number) => {
		if (i < step()) {
			setStep(i);
			props.onStepChange?.(i);
		}
	};

	return (
		<div class={className()} {...rest}>
			<StepsNav step={step} onJump={jump} class={`${pad[props.size ?? "md"]} pb-4`} />
			<div class={pad[props.size ?? "md"]}>
				<Show when={step() === 0}>
					{/* biome-ignore lint/a11y/noStaticElementInteractions: drop zone — the file input inside provides the keyboard path */}
					<div
						class="flex flex-col items-center gap-3 rounded-md border border-dashed border-border p-6 text-center"
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => {
							e.preventDefault();
							const f = e.dataTransfer?.files?.[0];
							if (f) readFile(f);
						}}
					>
						<p class="text-xs text-muted-foreground">Drop a CSV file here or choose one</p>
						<input
							type="file"
							accept=".csv,text/csv"
							aria-label="CSV file"
							class="text-xs text-foreground"
							onChange={(e) => {
								const f = e.currentTarget.files?.[0];
								if (f) readFile(f);
							}}
						/>
						<Show when={file()}>
							<p class="text-xs text-success">{`Loaded ${file()?.name} — ${rows().length} rows`}</p>
						</Show>
						<Show when={!file() && columns().length > 0}>
							<p class="text-xs text-muted-foreground">{`Using provided data — ${rows().length} rows`}</p>
						</Show>
					</div>
				</Show>
				<Show when={step() === 1}>
					<CsvColumnMapper
						columns={columns()}
						sample={rows().slice(0, 3)}
						fields={fields()}
						value={mapping()}
						onChange={setMapping}
					/>
				</Show>
				<Show when={step() === 2}>
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
							<For each={rows().slice(0, PREVIEW_ROWS)}>
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
					<p class="mt-2 text-2xs text-muted-foreground">
						{`Showing ${Math.min(PREVIEW_ROWS, rows().length)} of ${rows().length} rows`}
					</p>
				</Show>
				<Show when={step() === 3}>
					<dl class="space-y-1 text-xs">
						<div class="flex justify-between">
							<dt class="text-muted-foreground">File</dt>
							<dd class="text-foreground">{file()?.name ?? "Provided data"}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Rows</dt>
							<dd class="text-foreground">{rows().length}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Mapped fields</dt>
							<dd class="text-foreground">{`${Object.keys(mapping()).length} of ${fields().length}`}</dd>
						</div>
					</dl>
				</Show>
			</div>
			<div class={`flex items-center justify-between border-t border-border ${pad[props.size ?? "md"]} pt-4`}>
				<button
					type="button"
					disabled={step() === 0}
					class="h-9 rounded-md border border-border bg-transparent px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
					onClick={() => go(-1)}
				>
					{labels().back}
				</button>
				<span class="text-2xs tabular-nums text-muted-foreground">{`Step ${step() + 1} of ${STEPS.length}`}</span>
				<button
					type="button"
					disabled={!canNext()}
					class="h-9 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
					onClick={() => go(1)}
				>
					{last() ? labels().finish : labels().next}
				</button>
			</div>
		</div>
	);
}
