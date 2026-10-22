/**
 * PdfPreview — paginated document canvas with a prev/next pager and zoom select.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { controlSizes, controlVariants } from "../lib/variants";

const zoomOptions = [50, 75, 100, 125, 150, 200] as const;

export interface PdfPreviewProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Total page count, or an array of page thumbnail URLs. */
	pages?: number | string[];
	/** Controlled page number, 1-based. Falls back to internal state when unset. */
	page?: number;
	/** Called with the new 1-based page number. */
	onPageChange?: (page: number) => void;
	/** Initial zoom percent. @default 100 */
	zoom?: number;
	/** Show the zoom select. @default true */
	showZoom?: boolean;
}

/** Placeholder document page drawn when only a page count is given. */
function PageCanvas(props: { page: number }) {
	return (
		<div
			role="img"
			aria-label={`Page ${props.page}`}
			class="flex aspect-[8.5/11] w-full flex-col gap-2 border border-border bg-card p-5 shadow-sm"
		>
			<div class="h-3 w-1/2 rounded bg-foreground/20" />
			<div class="h-2 w-full rounded bg-muted-foreground/15" />
			<div class="h-2 w-full rounded bg-muted-foreground/15" />
			<div class="h-2 w-4/5 rounded bg-muted-foreground/15" />
			<div class="my-2 h-16 w-full rounded bg-primary/10" />
			<div class="h-2 w-full rounded bg-muted-foreground/15" />
			<div class="h-2 w-3/5 rounded bg-muted-foreground/15" />
		</div>
	);
}

export function PdfPreview(props: PdfPreviewProps) {
	const [local, rest] = splitProps(props, ["class", "pages", "page", "onPageChange", "zoom", "showZoom"]);
	const [internal, setInternal] = createSignal(1);
	const [zoom, setZoom] = createSignal(local.zoom ?? 100);

	const count = () => Math.max(1, typeof local.pages === "number" ? local.pages : (local.pages ?? []).length);
	const current = () => Math.min(count(), Math.max(1, local.page ?? internal()));
	const thumb = () => (Array.isArray(local.pages) ? local.pages[current() - 1] : undefined);

	const goTo = (p: number) => {
		const next = Math.min(count(), Math.max(1, p));
		if (local.page === undefined) setInternal(next);
		local.onPageChange?.(next);
	};

	const btn = `${controlVariants.outline} ${controlSizes.sm} inline-flex items-center gap-1 rounded-md font-medium disabled:opacity-50`;

	return (
		<div class={`solidui-pdf-preview w-full ${local.class ?? ""}`.trim()} {...rest}>
			<div class="flex items-center justify-between gap-2 border border-border bg-surface px-3 py-1.5">
				<div class="flex items-center gap-1">
					<button
						type="button"
						class={btn}
						aria-label="Previous page"
						disabled={current() <= 1}
						onClick={() => goTo(current() - 1)}
					>
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>
					<span class="px-2 text-xs tabular-nums text-muted-foreground">
						{current()} / {count()}
					</span>
					<button
						type="button"
						class={btn}
						aria-label="Next page"
						disabled={current() >= count()}
						onClick={() => goTo(current() + 1)}
					>
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>
				</div>
				<Show when={local.showZoom ?? true}>
					<select
						aria-label="Zoom"
						class="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						value={zoom()}
						onChange={(e) => setZoom(Number(e.currentTarget.value))}
					>
						<For each={zoomOptions}>{(z) => <option value={z}>{z}%</option>}</For>
					</select>
				</Show>
			</div>
			<div class="max-h-96 overflow-auto border border-t-0 border-border bg-muted/40 p-4">
				<div
					class="mx-auto w-full max-w-md"
					style={{ transform: `scale(${zoom() / 100})`, "transform-origin": "top center" }}
				>
					<Show when={thumb()} fallback={<PageCanvas page={current()} />}>
						{(src) => (
							<img src={src()} alt={`Page ${current()}`} class="w-full border border-border bg-card shadow-sm" />
						)}
					</Show>
				</div>
			</div>
		</div>
	);
}
