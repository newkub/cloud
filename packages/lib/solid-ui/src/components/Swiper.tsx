/**
 * Swiper - touch-swipeable slide container.
 */
import { createSignal, type JSX, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = { ...surfaceVariants, default: "" };

export interface SwiperProps extends JSX.HTMLAttributes<HTMLDivElement> {
	onSlideChange?: (index: number) => void;
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Swiper(props: SwiperProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"onSlideChange",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const [active, setActive] = createSignal(0);
	let track: HTMLDivElement | undefined;
	let startX = 0;
	let scrollStart = 0;
	let dragging = false;

	const onScroll = () => {
		if (!track) return;
		const slideWidth = track.clientWidth || 1;
		const index = Math.round(track.scrollLeft / slideWidth);
		if (index !== active()) {
			setActive(index);
			local.onSlideChange?.(index);
		}
	};

	const onPointerDown = (e: PointerEvent) => {
		dragging = true;
		startX = e.clientX;
		scrollStart = track?.scrollLeft ?? 0;
		track?.setPointerCapture(e.pointerId);
	};

	const onPointerMove = (e: PointerEvent) => {
		if (!dragging || !track) return;
		track.scrollLeft = scrollStart - (e.clientX - startX);
	};

	const scrollBehavior = (): ScrollBehavior =>
		typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
			? "auto"
			: "smooth";

	const endDrag = () => {
		if (!dragging || !track) return;
		dragging = false;
		const slideWidth = track.clientWidth || 1;
		const index = Math.round(track.scrollLeft / slideWidth);
		track.scrollTo({ left: index * slideWidth, behavior: scrollBehavior() });
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (!track) return;
		const slideWidth = track.clientWidth || 1;
		if (e.key === "ArrowRight") {
			e.preventDefault();
			track.scrollBy({ left: slideWidth, behavior: scrollBehavior() });
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			track.scrollBy({ left: -slideWidth, behavior: scrollBehavior() });
		}
	};

	const className = () =>
		[
			"relative w-full touch-pan-y overflow-hidden",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "none"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		// biome-ignore lint/a11y/useSemanticElements: APG carousel — region + roledescription announce the widget type
		<div class={className()} role="region" aria-roledescription="carousel" {...rest}>
			{/* biome-ignore lint/a11y/useSemanticElements: role=group labels the slide group for assistive tech */}
			<div
				ref={track}
				class="flex w-full cursor-grab snap-x snap-mandatory overflow-x-auto scroll-smooth motion-reduce:scroll-auto active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
				// biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable slide track is keyboard-navigable per APG carousel pattern
				tabIndex={0}
				role="group"
				aria-label="Slides"
				onKeyDown={onKeyDown}
				style={{ "scrollbar-width": "none" }}
				onScroll={onScroll}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
			>
				{local.children}
			</div>
		</div>
	);
}

export interface SwiperSlideProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function SwiperSlide(props: SwiperSlideProps) {
	const [local, rest] = splitProps(props, ["class", "children", "radius", "elevation"]);
	const className = () =>
		[
			"swiper-slide w-full shrink-0 grow-0 basis-full snap-center",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<div class={className()} {...rest}>
			{local.children}
		</div>
	);
}
