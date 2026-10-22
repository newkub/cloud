/**
 * Carousel - slide strip with controls, indicators and looping.
 */
import { createSignal, For, type JSX, mergeProps, onMount, Show, splitProps } from "solid-js";
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

export interface CarouselProps extends JSX.HTMLAttributes<HTMLElement> {
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	loop?: boolean;
	showControls?: boolean;
	showIndicators?: boolean;
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Carousel(props: CarouselProps) {
	const merged = mergeProps({ defaultIndex: 0, loop: true, showControls: true, showIndicators: true }, props);
	const [internal, setInternal] = createSignal(merged.defaultIndex);
	const [count, setCount] = createSignal(0);
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"index",
		"defaultIndex",
		"onIndexChange",
		"loop",
		"showControls",
		"showIndicators",
		"variant",
		"size",
		"onKeyDown",
		"radius",
		"elevation",
	]);

	const index = () => (local.index !== undefined ? local.index : internal());
	const setIndex = (next: number) => {
		const total = count();
		if (total === 0) return;
		const wrapped = merged.loop ? (next + total) % total : Math.max(0, Math.min(total - 1, next));
		setInternal(wrapped);
		local.onIndexChange?.(wrapped);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (typeof local.onKeyDown === "function") {
			(local.onKeyDown as (e: KeyboardEvent) => void)(e);
		}
		if (e.defaultPrevented) return;
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			setIndex(index() - 1);
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			setIndex(index() + 1);
		}
	};

	const className = () =>
		[
			"group relative w-full overflow-hidden",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "none"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const btnBase =
		"absolute top-1/2 z-dropdown flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow transition-opacity hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

	let track: HTMLDivElement | undefined;
	onMount(() => {
		if (track) setCount(track.querySelectorAll('[role="group"]').length);
	});

	return (
		<section
			class={className()}
			aria-roledescription="carousel"
			aria-label="Carousel"
			// biome-ignore lint/a11y/noNoninteractiveTabindex: carousel region is keyboard-navigable per APG
			tabIndex={0}
			onKeyDown={onKeyDown}
			{...rest}
		>
			<div
				ref={track}
				class="flex transition-transform duration-300 ease-in-out motion-reduce:transition-none"
				style={{ transform: `translateX(-${index() * 100}%)` }}
			>
				{local.children}
			</div>
			<Show when={merged.showControls && count() > 1}>
				<button
					type="button"
					class={`${btnBase} left-2`}
					aria-label="Previous slide"
					onClick={() => setIndex(index() - 1)}
				>
					‹
				</button>
				<button
					type="button"
					class={`${btnBase} right-2`}
					aria-label="Next slide"
					onClick={() => setIndex(index() + 1)}
				>
					›
				</button>
			</Show>
			<Show when={merged.showIndicators && count() > 1}>
				<div class="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
					<For each={Array.from({ length: count() }, (_, i) => i)}>
						{(i) => (
							<button
								type="button"
								class="flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								aria-label={`Go to slide ${i + 1}`}
								aria-current={i === index()}
								onClick={() => setIndex(i)}
							>
								<span
									class={`h-1.5 w-1.5 rounded-full transition-colors ${
										i === index() ? "bg-foreground" : "bg-foreground/30"
									}`}
								/>
							</button>
						)}
					</For>
				</div>
			</Show>
		</section>
	);
}

export interface CarouselItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function CarouselItem(props: CarouselItemProps) {
	const [local, rest] = splitProps(props, ["class", "children", "radius", "elevation"]);
	const className = () =>
		[
			"w-full shrink-0 grow-0 basis-full",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		// biome-ignore lint/a11y/useSemanticElements: APG carousel slides use role="group"
		<div class={className()} role="group" aria-roledescription="slide" {...rest}>
			{local.children}
		</div>
	);
}
