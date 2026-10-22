import { createSignal, onCleanup, onMount } from "solid-js";

export interface ZoomPanState {
	scale: number;
	translateX: number;
	translateY: number;
	isDragging: boolean;
}

export interface ZoomPanOptions {
	minScale?: number;
	maxScale?: number;
	enableZoom?: boolean;
	enablePan?: boolean;
}

const defaultZoomPanOptions: ZoomPanOptions = {
	minScale: 0.5,
	maxScale: 4,
	enableZoom: true,
	enablePan: true,
};

export function useZoomPan(element: () => HTMLElement | null, options: ZoomPanOptions = {}) {
	const opts = { ...defaultZoomPanOptions, ...options };
	const minScale = opts.minScale ?? 0.5;
	const maxScale = opts.maxScale ?? 4;

	const [state, setState] = createSignal<ZoomPanState>({
		scale: 1,
		translateX: 0,
		translateY: 0,
		isDragging: false,
	});
	const [startPos, setStartPos] = createSignal({ x: 0, y: 0 });
	const [startTranslate, setStartTranslate] = createSignal({ x: 0, y: 0 });

	const startDrag = (x: number, y: number) => {
		if (!opts.enablePan) return;
		setState((prev) => ({ ...prev, isDragging: true }));
		setStartPos({ x, y });
		setStartTranslate({ x: state().translateX, y: state().translateY });
	};
	const moveDrag = (x: number, y: number) => {
		if (!state().isDragging || !opts.enablePan) return;
		setState((prev) => ({
			...prev,
			translateX: (startTranslate().x ?? 0) + (x - startPos().x),
			translateY: (startTranslate().y ?? 0) + (y - startPos().y),
		}));
	};
	const endDrag = () => setState((prev) => ({ ...prev, isDragging: false }));

	const handleWheel = (event: WheelEvent) => {
		if (!opts.enableZoom) return;
		event.preventDefault();
		const delta = event.deltaY > 0 ? 0.9 : 1.1;
		setState((prev) => ({ ...prev, scale: Math.max(minScale, Math.min(maxScale, prev.scale * delta)) }));
	};

	const handleTouchStart = (event: TouchEvent) => {
		const touch = event.touches.length === 1 ? event.touches[0] : undefined;
		if (touch) startDrag(touch.clientX, touch.clientY);
	};
	const handleTouchMove = (event: TouchEvent) => {
		const touch = event.touches.length === 1 ? event.touches[0] : undefined;
		if (touch) moveDrag(touch.clientX, touch.clientY);
	};

	const reset = () => setState({ scale: 1, translateX: 0, translateY: 0, isDragging: false });
	const zoomIn = () => setState((prev) => ({ ...prev, scale: Math.min(maxScale, prev.scale * 1.2) }));
	const zoomOut = () => setState((prev) => ({ ...prev, scale: Math.max(minScale, prev.scale / 1.2) }));

	// Attach event listeners
	onMount(() => {
		const el = element();
		if (!el) return;

		const onMouseDown = (e: MouseEvent) => startDrag(e.clientX, e.clientY);
		const onMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
		el.addEventListener("wheel", handleWheel, { passive: false });
		el.addEventListener("mousedown", onMouseDown);
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", endDrag);
		el.addEventListener("touchstart", handleTouchStart, { passive: false });
		el.addEventListener("touchmove", handleTouchMove, { passive: false });
		el.addEventListener("touchend", endDrag);

		onCleanup(() => {
			el.removeEventListener("wheel", handleWheel);
			el.removeEventListener("mousedown", onMouseDown);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", endDrag);
			el.removeEventListener("touchstart", handleTouchStart);
			el.removeEventListener("touchmove", handleTouchMove);
			el.removeEventListener("touchend", endDrag);
		});
	});

	return {
		state,
		reset,
		zoomIn,
		zoomOut,
	};
}
