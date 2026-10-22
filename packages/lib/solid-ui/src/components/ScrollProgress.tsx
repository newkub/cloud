/**
 * ScrollProgress — fixed top bar showing page scroll progress
 */
import { createSignal, type JSX, onCleanup, onMount, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type StatusVariant,
	statusVariants,
} from "../lib/variants";

const variantMap: Record<StatusVariant, string> = {
	...statusVariants,
	default: "bg-primary",
	primary: "bg-primary",
	success: "bg-success",
	warning: "bg-warning",
	destructive: "bg-destructive",
	info: "bg-info",
};

export interface ScrollProgressProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: StatusVariant;
	/** Progress bar height in px */
	height?: number;
	/** Fixed to the viewport top. Set false inside preview frames. @default true */
	fixed?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function ScrollProgress(props: ScrollProgressProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "height", "fixed", "style", "radius", "elevation"]);
	const [progress, setProgress] = createSignal(0);

	onMount(() => {
		const onScroll = () => {
			const h = document.documentElement;
			const scrollTop = h.scrollTop || document.body.scrollTop;
			const scrollHeight = h.scrollHeight - h.clientHeight;
			setProgress(scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		onCleanup(() => window.removeEventListener("scroll", onScroll));
	});

	const trackClass = () =>
		[
			(local.fixed ?? true) ? "fixed top-0 left-0 right-0 z-fixed" : "absolute inset-x-0 top-0",
			"bg-transparent pointer-events-none",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div
			class={trackClass()}
			style={{ height: `${local.height ?? 2}px`, ...(typeof local.style === "object" ? local.style : {}) }}
			role="progressbar"
			aria-valuenow={Math.round(progress())}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label="Page scroll progress"
			{...rest}
		>
			<div
				class={`h-full ${variantMap[local.variant ?? "default"]} transition-[width] duration-75 motion-reduce:transition-none`}
				style={{ width: `${progress()}%` }}
			/>
		</div>
	);
}
