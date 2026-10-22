/**
 * AnchorNav — vertical in-page section nav; the active item is tracked via IntersectionObserver on element ids.
 */
import { createSignal, For, type JSX, onCleanup, onMount, splitProps } from "solid-js";

export interface AnchorNavItem {
	/** Target element id (without the `#`). */
	id: string;
	/** Link label. */
	label: string;
}

export interface AnchorNavProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "onSelect"> {
	/** Sections to link to. */
	items: AnchorNavItem[];
	/** Pixels reserved above the viewport top when judging which section is active. @default 0 */
	offset?: number;
	/** Controlled active item id — overrides observer tracking when set. */
	value?: string;
	/** Called with the item id when a link is clicked. */
	onSelect?: (id: string) => void;
	/** Smooth-scroll to the section on click. @default true */
	smooth?: boolean;
}

export function AnchorNav(props: AnchorNavProps) {
	const [local, rest] = splitProps(props, ["class", "items", "offset", "value", "onSelect", "smooth"]);
	const [seen, setSeen] = createSignal<string>();
	const current = () => local.value ?? seen() ?? local.items?.[0]?.id;

	onMount(() => {
		const els = (local.items ?? [])
			.map((item) => document.getElementById(item.id))
			.filter((el): el is HTMLElement => el !== null);
		if (typeof IntersectionObserver !== "function" || els.length === 0) return;
		const offset = local.offset ?? 0;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setSeen(entry.target.id);
				}
			},
			{ rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 },
		);
		for (const el of els) observer.observe(el);
		onCleanup(() => observer.disconnect());
	});

	const onClick = (item: AnchorNavItem) => (e: MouseEvent) => {
		const target = document.getElementById(item.id);
		if (target) {
			e.preventDefault();
			const reduced =
				typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			target.scrollIntoView({ behavior: local.smooth === false || reduced ? "auto" : "smooth" });
		}
		setSeen(item.id);
		local.onSelect?.(item.id);
	};

	return (
		<nav aria-label="On this page" class={`solidui-anchor-nav ${local.class ?? ""}`.trim()} {...rest}>
			<ul class="space-y-0.5">
				<For each={local.items ?? []}>
					{(item) => {
						const active = () => item.id === current();
						return (
							<li>
								<a
									href={`#${item.id}`}
									class={`block border-l-2 py-1.5 pl-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
										active()
											? "border-primary font-medium text-primary"
											: "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
									}`}
									aria-current={active() ? "location" : undefined}
									onClick={onClick(item)}
								>
									{item.label}
								</a>
							</li>
						);
					}}
				</For>
			</ul>
		</nav>
	);
}
