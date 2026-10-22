/**
 * Pager — compact previous/next pager with a "Page n / m" label.
 * @deprecated Use `Pagination` — supports `siblingCount`, `showNumbers`,
 * `disabled` and compound parts.
 */
import { type JSX, splitProps } from "solid-js";
import { Pagination } from "./Pagination";

export interface PagerProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "onChange"> {
	/** Current page, 1-based. */
	page: number;
	/** Total pages. */
	total: number;
	/** Called with the new 1-based page. */
	onChange?: (page: number) => void;
	/** Disable both buttons. @default false */
	disabled?: boolean;
}

export function Pager(props: PagerProps) {
	const [local, rest] = splitProps(props, ["page", "total", "onChange", "disabled"]);
	return (
		<Pagination
			page={local.page}
			totalPages={local.total}
			showNumbers={false}
			disabled={local.disabled}
			onPageChange={(p) => local.onChange?.(p)}
			{...rest}
		/>
	);
}
