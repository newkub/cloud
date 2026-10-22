/**
 * BeforeAfter — draggable comparison slider for two images or arbitrary content.
 */
import { createSignal, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface BeforeAfterProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Content revealed on the left (drag right to reveal) */
	before: JSX.Element;
	/** Content on the right */
	after: JSX.Element;
	/** Initial split position 0–100 @default 50 */
	position?: number;
	/** Callback while dragging */
	onPositionChange?: (position: number) => void;
	/** Corner labels @default "Before" / "After" */
	beforeLabel?: string;
	afterLabel?: string;
	/** Fixed aspect ratio (e.g. 16/9) — auto when unset */
	aspectRatio?: number;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function BeforeAfter(props: BeforeAfterProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"before",
		"after",
		"position",
		"onPositionChange",
		"beforeLabel",
		"afterLabel",
		"aspectRatio",
		"radius",
		"elevation",
	]);
	const [pos, setPos] = createSignal(local.position ?? 50);
	let track: HTMLDivElement | undefined;

	const update = (clientX: number) => {
		if (!track) return;
		const rect = track.getBoundingClientRect();
		const next = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
		setPos(next);
		local.onPositionChange?.(next);
	};

	const onPointerDown = (e: PointerEvent) => {
		update(e.clientX);
		const move = (ev: PointerEvent) => update(ev.clientX);
		const up = () => {
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
	};

	return (
		<div
			ref={track}
			class={`solidui-before-after relative touch-pan-y select-none overflow-hidden border border-border ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			style={local.aspectRatio ? { "aspect-ratio": String(local.aspectRatio) } : undefined}
			onPointerDown={onPointerDown}
			{...rest}
		>
			<div class="absolute inset-0">{local.after}</div>
			<div class="absolute inset-0 overflow-hidden" style={{ width: `${pos()}%` }}>
				<div class="absolute inset-0" style={{ width: `${10000 / Math.max(pos(), 0.01)}%` }}>
					{local.before}
				</div>
			</div>
			<div
				class="absolute inset-y-0 w-0.5 bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
				style={{ left: `${pos()}%` }}
			>
				<button
					type="button"
					class="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					aria-label="Drag to compare before and after"
					role="slider"
					aria-valuenow={Math.round(pos())}
					aria-valuemin={0}
					aria-valuemax={100}
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
							e.preventDefault();
							const rect = track?.getBoundingClientRect();
							const delta = e.key === "ArrowLeft" ? -2 : 2;
							update((rect?.left ?? 0) + ((pos() + delta) / 100) * (rect?.width ?? 0));
						}
					}}
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="h-4 w-4"
						aria-hidden="true"
					>
						<path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
					</svg>
				</button>
			</div>
			<span class="pointer-events-none absolute top-2 left-2 rounded bg-background/80 px-1.5 py-0.5 text-2xs font-medium text-foreground">
				{local.beforeLabel ?? "Before"}
			</span>
			<span class="pointer-events-none absolute top-2 right-2 rounded bg-background/80 px-1.5 py-0.5 text-2xs font-medium text-foreground">
				{local.afterLabel ?? "After"}
			</span>
		</div>
	);
}
