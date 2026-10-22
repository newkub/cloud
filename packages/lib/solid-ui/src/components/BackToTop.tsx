/**
 * BackToTop - floating button that appears after scrolling and returns to top.
 */
import { createSignal, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
import {
	type ControlVariant,
	controlSizes,
	controlVariants,
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
} from "../lib/variants";

export interface BackToTopProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ControlVariant;
	size?: "sm" | "md" | "lg";
	threshold?: number;
	label?: string;
	/** Fixed to the viewport corner. Set false inside preview frames. @default true */
	fixed?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function BackToTop(props: BackToTopProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"children",
		"threshold",
		"label",
		"onClick",
		"fixed",
		"radius",
		"elevation",
	]);
	const [visible, setVisible] = createSignal(false);

	onMount(() => {
		const threshold = local.threshold ?? 300;
		const onScroll = () => setVisible(window.scrollY > threshold);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		onCleanup(() => window.removeEventListener("scroll", onScroll));
	});

	const onClick = (e: MouseEvent) => {
		const reduced =
			typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};

	const base = () =>
		`${(local.fixed ?? true) ? "fixed bottom-4 right-4 z-fixed" : ""} inline-flex items-center justify-center transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`;
	const className = () =>
		[
			base(),
			local.size ? controlSizes[local.size] : "h-10 w-10",
			controlVariants[local.variant ?? "primary"],
			radiusMap[local.radius ?? "full"],
			elevationMap[local.elevation ?? "lg"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<Show when={visible()}>
			<button type="button" class={className()} aria-label={local.label ?? "Back to top"} onClick={onClick} {...rest}>
				{local.children ?? "↑"}
			</button>
		</Show>
	);
}
