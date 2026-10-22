/**
 * ScrollSpy - highlights the nav item matching the section in view.
 */
import { createSignal, For, type JSX, onCleanup, onMount, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface ScrollSpyItem {
	id: string;
	label: string;
}

export interface ScrollSpyProps extends JSX.HTMLAttributes<HTMLElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	items?: ScrollSpyItem[];
	offset?: number;
	onActiveChange?: (id: string) => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function ScrollSpy(props: ScrollSpyProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"children",
		"items",
		"offset",
		"onActiveChange",
		"radius",
		"elevation",
	]);
	const [active, setActive] = createSignal("");

	onMount(() => {
		const onScroll = () => {
			const offset = local.offset ?? 100;
			let current = "";
			for (const item of local.items ?? []) {
				const el = document.getElementById(item.id);
				if (el && el.getBoundingClientRect().top <= offset) {
					current = item.id;
				}
			}
			if (current !== active()) {
				setActive(current);
				local.onActiveChange?.(current);
			}
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		onCleanup(() => window.removeEventListener("scroll", onScroll));
	});

	const className = () =>
		[
			"flex flex-col gap-1 text-sm",
			local.variant ? surfaceVariants[local.variant] : "",
			local.size ? paddingSizes[local.size] : "",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const linkClass = (id: string) =>
		[
			"block rounded px-2 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
			active() === id ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:text-foreground",
		].join(" ");

	return (
		<nav class={className()} aria-label="Table of contents" {...rest}>
			<For each={local.items ?? []}>
				{(item) => (
					<a
						href={`#${item.id}`}
						class={linkClass(item.id)}
						aria-current={active() === item.id ? "location" : undefined}
					>
						{item.label}
					</a>
				)}
			</For>
			{local.children}
		</nav>
	);
}
