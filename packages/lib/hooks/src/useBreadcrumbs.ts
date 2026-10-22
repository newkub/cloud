import { type Accessor, createMemo } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface Breadcrumb {
	/** Display text for the crumb */
	label: string;
	/** Accumulated path up to and including this segment */
	href: string;
}

export interface BreadcrumbsOptions {
	/** Label for the root `/` crumb. @default "Home" */
	homeLabel?: string;
	/** Format a raw path segment into a label — default title-cases `-`/`_` separators */
	formatLabel?: (segment: string) => string;
	/** Include the home crumb even when the pathname is `/`. @default true */
	includeHome?: boolean;
}

const defaultFormat = (segment: string): string => {
	let text = segment;
	try {
		text = decodeURIComponent(segment);
	} catch {
		/* keep the raw segment */
	}
	text = text.replace(/[-_]+/g, " ").trim();
	return text.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
};

/**
 * Derive a breadcrumb trail from a pathname — always starts with a `homeLabel`
 * crumb at `/`, then one crumb per path segment with cumulative `href`s.
 * `pathname` may be a value or accessor; defaults to `window.location.pathname`.
 * Segments are formatted via `formatLabel` (default: decode + title-case).
 *
 * @param pathname — Path to split, or accessor (defaults to the current location)
 * @param options — `homeLabel`/`formatLabel`/`includeHome`
 * @returns `{ crumbs }` — accessor for `{ label, href }[]`
 *
 * @example
 * const { crumbs } = useBreadcrumbs(() => location.pathname);
 * <nav><For each={crumbs()}>{(c) => <a href={c.href}>{c.label}</a>}</For></nav>
 */
export function useBreadcrumbs(
	pathname?: MaybeAccessor<string>,
	options?: BreadcrumbsOptions,
): { crumbs: Accessor<Breadcrumb[]> } {
	const homeLabel = options?.homeLabel ?? "Home";
	const format = options?.formatLabel ?? defaultFormat;
	const includeHome = options?.includeHome ?? true;

	const crumbs = createMemo<Breadcrumb[]>(() => {
		const raw = read(pathname ?? (() => (typeof window === "undefined" ? "/" : window.location.pathname)));
		const segments = (raw.split("?")[0] ?? "").split("#")[0]?.split("/").filter(Boolean) ?? [];
		const trail: Breadcrumb[] = [];
		if (includeHome || segments.length === 0) trail.push({ label: homeLabel, href: "/" });
		let href = "";
		for (const seg of segments) {
			href += `/${seg}`;
			trail.push({ label: format(seg), href });
		}
		return trail;
	});

	return { crumbs };
}
