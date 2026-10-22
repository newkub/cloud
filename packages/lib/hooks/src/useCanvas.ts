import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export type CanvasDrawCallback = (ctx: CanvasRenderingContext2D, width: number, height: number) => void;

export interface CanvasState {
	/** 2D rendering context — `null` until the element resolves or when 2D is unavailable */
	ctx: Accessor<CanvasRenderingContext2D | null>;
	/** CSS-pixel width of the canvas box */
	width: Accessor<number>;
	/** CSS-pixel height of the canvas box */
	height: Accessor<number>;
	/** Erase the canvas (`clearRect` over the full CSS-pixel box) */
	clear: () => void;
	/** `clear()` then invoke `cb(ctx, width, height)` — no-op without a context */
	redraw: (cb: CanvasDrawCallback) => void;
}

/**
 * 2D canvas context as signals — resolves `getContext("2d")` for the target
 * element, scales the backing store by `devicePixelRatio` for crisp lines and
 * keeps `width()`/`height()` (CSS pixels) in sync via `ResizeObserver`.
 * Reactive: rebinds when the element accessor changes. The observer is
 * disconnected on cleanup; safe when 2D contexts are unavailable (jsdom) —
 * `ctx()` stays `null` and `clear`/`redraw` no-op.
 *
 * @param target — `<canvas>` element or an accessor resolving to one
 * @returns `{ ctx, width, height, clear, redraw }`
 *
 * @example
 * let canvas!: HTMLCanvasElement;
 * const c = useCanvas(() => canvas);
 * <canvas ref={canvas} class="h-40 w-full" />
 * <button onClick={() => c.redraw((ctx, w, h) => ctx.fillRect(0, 0, w, h))}>fill</button>
 */
export function useCanvas(target: MaybeAccessor<HTMLCanvasElement | undefined>): CanvasState {
	const [ctx, setCtx] = createSignal<CanvasRenderingContext2D | null>(null);
	const [width, setWidth] = createSignal(0);
	const [height, setHeight] = createSignal(0);

	const clear = () => {
		const c = ctx();
		if (c) c.clearRect(0, 0, width(), height());
	};

	const redraw = (cb: CanvasDrawCallback) => {
		const c = ctx();
		if (!c) return;
		clear();
		cb(c, width(), height());
	};

	createEffect(() => {
		const el = resolve(target);
		if (!el) {
			setCtx(null);
			return;
		}
		const context = el.getContext("2d");
		setCtx(context);
		const resize = () => {
			const dpr = (typeof window !== "undefined" && window.devicePixelRatio) || 1;
			const rect = el.getBoundingClientRect();
			const w = rect.width || el.clientWidth;
			const h = rect.height || el.clientHeight;
			setWidth(w);
			setHeight(h);
			el.width = Math.max(1, Math.round(w * dpr));
			el.height = Math.max(1, Math.round(h * dpr));
			context?.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		if (typeof ResizeObserver !== "undefined") {
			const observer = new ResizeObserver(resize);
			observer.observe(el);
			onCleanup(() => observer.disconnect());
		}
		onCleanup(() => setCtx(null));
	});

	return { ctx, width, height, clear, redraw };
}
