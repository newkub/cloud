/**
 * LiveRegion - polite/assertive aria-live announcer for dynamic updates.
 */
import { type JSX, splitProps } from "solid-js";

export interface LiveRegionProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Announcement text; each change is read by screen readers. */
	message?: string;
	/** Live politeness. @default "polite" */
	mode?: "polite" | "assertive";
	/** Visually hide the region (announce-only). @default true */
	visuallyHidden?: boolean;
}

export function LiveRegion(props: LiveRegionProps) {
	const [local, rest] = splitProps(props, ["class", "message", "mode", "visuallyHidden", "children"]);

	const hiddenClass = "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 [clip:rect(0,0,0,0)]";

	const className = () =>
		["solidui-live-region", (local.visuallyHidden ?? true) ? hiddenClass : "", local.class ?? ""]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} role="status" aria-live={local.mode ?? "polite"} aria-atomic="true" {...rest}>
			{local.message}
			{local.children}
		</div>
	);
}
