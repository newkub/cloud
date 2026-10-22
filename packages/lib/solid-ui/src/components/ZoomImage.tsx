/**
 * ZoomImage — hover loupe that magnifies the area under the cursor.
 */
import { createSignal, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

const LOUPE = 112; // px diameter
const R = LOUPE / 2;

interface LoupePos {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface ZoomImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
	/** Magnification factor. @default 2 */
	zoom?: number;
	/** Corner radius. */
	radius?: Radius;
}

export function ZoomImage(props: ZoomImageProps) {
	const [local, rest] = splitProps(props, ["class", "src", "zoom", "radius", "alt"]);
	const [pos, setPos] = createSignal<LoupePos | null>(null);
	const zoom = () => local.zoom ?? 2;
	let root: HTMLDivElement | undefined;

	onMount(() => {
		const move = (e: MouseEvent) => {
			const rect = root?.getBoundingClientRect();
			if (!rect || !local.src) return;
			setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, w: rect.width, h: rect.height });
		};
		const leave = () => setPos(null);
		root?.addEventListener("mousemove", move);
		root?.addEventListener("mouseleave", leave);
		onCleanup(() => {
			root?.removeEventListener("mousemove", move);
			root?.removeEventListener("mouseleave", leave);
		});
	});

	return (
		<div
			ref={root}
			class={`solidui-zoom-image relative cursor-crosshair overflow-hidden border border-border bg-muted ${radiusMap[local.radius ?? "lg"]} ${local.class ?? ""}`.trim()}
		>
			<Show
				when={local.src}
				fallback={
					<div
						role="img"
						aria-label={local.alt ?? "Zoomable image placeholder"}
						class="aspect-video w-full bg-gradient-to-br from-primary/40 via-muted to-info/30"
					/>
				}
			>
				{(src) => <img {...rest} src={src()} alt={local.alt ?? ""} class="block w-full" />}
			</Show>
			<Show when={pos()}>
				{(p) => (
					<div
						aria-hidden="true"
						class="pointer-events-none absolute z-10 overflow-hidden rounded-full border-2 border-surface shadow-lg ring-1 ring-border"
						style={{
							width: `${LOUPE}px`,
							height: `${LOUPE}px`,
							left: `${p().x - R}px`,
							top: `${p().y - R}px`,
						}}
					>
						<img
							src={local.src}
							alt=""
							style={{
								position: "absolute",
								width: `${p().w}px`,
								height: `${p().h}px`,
								left: `${R - p().x}px`,
								top: `${R - p().y}px`,
								transform: `scale(${zoom()})`,
								"transform-origin": `${p().x}px ${p().y}px`,
								"max-width": "none",
							}}
						/>
					</div>
				)}
			</Show>
		</div>
	);
}
