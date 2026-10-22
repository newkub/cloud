/**
 * ImageCropper - image with draggable crop-frame overlay; reports crop rect on confirm.
 */
import { createSignal, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";
import { Button } from "./Button";

export interface CropRect {
	/** Left offset, 0..1 of image width. */
	x: number;
	/** Top offset, 0..1 of image height. */
	y: number;
	/** Crop width, 0..1 of image width. */
	w: number;
	/** Crop height, 0..1 of image height. */
	h: number;
}

export interface ImageCropperProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Image URL. */
	src: string;
	/** Alt text. @default "Crop image" */
	alt?: string;
	/** Fixed aspect ratio (w/h); free-form when omitted. */
	aspect?: number;
	/** Called with the normalized crop rect. */
	onCrop?: (rect: CropRect) => void;
	/** Corner radius. */
	radius?: Radius;
}

export function ImageCropper(props: ImageCropperProps) {
	const [local, rest] = splitProps(props, ["class", "src", "alt", "aspect", "onCrop", "radius"]);
	const [rect, setRect] = createSignal<CropRect>({ x: 0.2, y: 0.2, w: 0.6, h: 0.6 });
	let frame: HTMLDivElement | undefined;
	let drag: { startX: number; startY: number; orig: CropRect } | null = null;

	const onDown = (e: PointerEvent) => {
		drag = { startX: e.clientX, startY: e.clientY, orig: rect() };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	};
	const onMove = (e: PointerEvent) => {
		if (!drag || !frame) return;
		const box = frame.getBoundingClientRect();
		const dx = (e.clientX - drag.startX) / box.width;
		const dy = (e.clientY - drag.startY) / box.height;
		setRect({
			...drag.orig,
			x: Math.min(Math.max(0, drag.orig.x + dx), 1 - drag.orig.w),
			y: Math.min(Math.max(0, drag.orig.y + dy), 1 - drag.orig.h),
		});
	};
	const onUp = () => (drag = null);

	const className = () => ["solidui-image-cropper flex flex-col gap-2", local.class ?? ""].filter(Boolean).join(" ");

	return (
		<div class={className()} {...rest}>
			<div ref={frame} class={`relative overflow-hidden bg-muted ${radiusMap[local.radius ?? "md"]}`}>
				<img src={local.src} alt={local.alt ?? "Crop image"} class="block w-full select-none" draggable={false} />
				<div
					class="absolute cursor-move border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] touch-none"
					style={{
						left: `${rect().x * 100}%`,
						top: `${rect().y * 100}%`,
						width: `${rect().w * 100}%`,
						height: `${rect().h * 100}%`,
						"aspect-ratio": local.aspect ? String(local.aspect) : undefined,
					}}
					role="presentation"
					onPointerDown={onDown}
					onPointerMove={onMove}
					onPointerUp={onUp}
				/>
			</div>
			<div class="flex justify-end">
				<Button variant="primary" class="h-8 px-3 text-xs" onClick={() => local.onCrop?.(rect())}>
					Crop
				</Button>
			</div>
		</div>
	);
}
