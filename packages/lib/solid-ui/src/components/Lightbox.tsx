/**
 * Lightbox - fullscreen image gallery overlay with navigation.
 */

import { useEscapeKey } from "@wrikka/hooks";
import { createSignal, type JSX, mergeProps, onCleanup, onMount, Show, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { type Elevation, elevationMap, type Radius, radiusMap, scrimVariants } from "../lib/variants";

export interface LightboxImage {
	src: string;
	alt?: string;
	caption?: string;
}

export interface LightboxProps extends JSX.HTMLAttributes<HTMLDivElement> {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	images?: LightboxImage[];
	/** Single-image shorthand — used when `images` is not set */
	src?: string;
	/** Alt text for the `src` image */
	alt?: string;
	/** Show zoom controls (+/−/reset) @default false */
	zoomable?: boolean;
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	/** Scrim style behind the lightbox content. */
	variant?: keyof typeof scrimVariants;
	/** Image corner radius. @default "lg" */
	radius?: Radius;
	/** Image shadow elevation. */
	elevation?: Elevation;
}

function LightboxContent(props: LightboxProps) {
	const merged = mergeProps({ defaultIndex: 0 }, props);
	const [internal, setInternal] = createSignal(merged.defaultIndex);
	const [zoom, setZoom] = createSignal(1);
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"images",
		"src",
		"alt",
		"zoomable",
		"index",
		"defaultIndex",
		"onIndexChange",
		"onOpenChange",
		"variant",
		"radius",
		"elevation",
	]);

	const images = () => local.images ?? (local.src ? [{ src: local.src, alt: local.alt }] : []);
	const index = () => (local.index !== undefined ? local.index : internal());
	const current = () => images()[index()];

	const setIndex = (next: number) => {
		const total = images().length;
		if (total === 0) return;
		const wrapped = (next + total) % total;
		setInternal(wrapped);
		local.onIndexChange?.(wrapped);
	};

	useEscapeKey(() => local.onOpenChange?.(false));

	onMount(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "ArrowLeft") setIndex(index() - 1);
			else if (e.key === "ArrowRight") setIndex(index() + 1);
		}
		document.addEventListener("keydown", onKeyDown);
		onCleanup(() => document.removeEventListener("keydown", onKeyDown));
	});

	const navBtn =
		"absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";
	const ctrlBtn =
		"flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

	return (
		<Portal>
			<div
				class={`fixed inset-0 z-modal ${scrimVariants[local.variant ?? "dark"]} motion-safe:animate-[su-fade-in_var(--su-transition-normal)]`}
				onClick={() => local.onOpenChange?.(false)}
				aria-hidden="true"
			/>
			<div
				class={`pointer-events-none fixed inset-0 z-modal flex items-center justify-center p-4 ${local.class ?? ""}`}
				role="dialog"
				aria-modal="true"
				aria-label="Image lightbox"
				{...rest}
			>
				<div class="pointer-events-auto absolute right-4 top-4 flex gap-2">
					<Show when={local.zoomable}>
						<button
							type="button"
							class={ctrlBtn}
							aria-label="Zoom out"
							onClick={(e) => {
								e.stopPropagation();
								setZoom((z) => Math.max(0.5, z - 0.5));
							}}
						>
							−
						</button>
						<button
							type="button"
							class={ctrlBtn}
							aria-label="Reset zoom"
							onClick={(e) => {
								e.stopPropagation();
								setZoom(1);
							}}
						>
							{Math.round(zoom() * 100)}%
						</button>
						<button
							type="button"
							class={ctrlBtn}
							aria-label="Zoom in"
							onClick={(e) => {
								e.stopPropagation();
								setZoom((z) => Math.min(4, z + 0.5));
							}}
						>
							+
						</button>
					</Show>
					<button type="button" class={ctrlBtn} aria-label="Close lightbox" onClick={() => local.onOpenChange?.(false)}>
						✕
					</button>
				</div>
				<Show when={images().length > 1}>
					<button
						type="button"
						class={`${navBtn} pointer-events-auto left-4`}
						aria-label="Previous image"
						onClick={() => setIndex(index() - 1)}
					>
						‹
					</button>
				</Show>
				<div class="pointer-events-auto max-h-full max-w-full">
					<Show when={current()}>
						{(img) => (
							<figure class="flex flex-col items-center gap-2">
								<img
									src={img().src}
									alt={img().alt ?? ""}
									class={`max-h-[80vh] max-w-full object-contain transition-transform motion-reduce:transition-none ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""}`}
									style={{ transform: `scale(${zoom()})` }}
								/>
								<Show when={img().caption}>
									<figcaption class="text-sm text-white/80">{img().caption}</figcaption>
								</Show>
							</figure>
						)}
					</Show>
					{local.children}
				</div>
				<Show when={images().length > 1}>
					<button
						type="button"
						class={`${navBtn} pointer-events-auto right-4`}
						aria-label="Next image"
						onClick={() => setIndex(index() + 1)}
					>
						›
					</button>
					<div class="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
						{index() + 1} / {images().length}
					</div>
				</Show>
			</div>
		</Portal>
	);
}

export function Lightbox(props: LightboxProps) {
	const merged = mergeProps({ open: false }, props);
	return (
		<Show when={merged.open}>
			<LightboxContent {...merged} />
		</Show>
	);
}
