/**
 * StatusBar - bottom application bar for status items, hints and indicators.
 */
import { type JSX, splitProps } from "solid-js";

export interface StatusBarProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Right-aligned slot. */
	end?: JSX.Element;
}

export function StatusBar(props: StatusBarProps) {
	const [local, rest] = splitProps(props, ["class", "end", "children"]);

	const className = () =>
		[
			"solidui-status-bar flex h-7 items-center gap-3 border-t border-border bg-surface px-3 text-xs text-muted-foreground",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<footer class={className()} {...rest}>
			<div class="flex flex-1 items-center gap-3 min-w-0">{local.children}</div>
			{local.end ? <div class="flex items-center gap-3 shrink-0">{local.end}</div> : null}
		</footer>
	);
}
