/**
 * SignaturePad — canvas signature capture; emits dataURL on stroke end.
 */
import { createSignal, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface SignaturePadProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Emitted as PNG data URL when a stroke ends. */
	onEnd?: (dataUrl: string) => void;
	/** Alias for `onEnd` — called with the PNG data URL whenever the drawing changes. */
	onChange?: (dataUrl: string) => void;
	/** Called at the start of each stroke. */
	onStrokeStart?: () => void;
	strokeColor?: string;
	/** Alias for `strokeColor`. */
	penColor?: string;
	/** Stroke width px. @default 2.5 */
	strokeWidth?: number;
	/** Alias for `strokeWidth`. */
	penWidth?: number;
	/** Clear button. @default true */
	clearable?: boolean;
	/** Undo button — removes the last stroke. @default false */
	undoable?: boolean;
	/** Called after clearing. */
	onClear?: () => void;
	/** Called after undoing a stroke — receives remaining stroke count. */
	onUndo?: (remaining: number) => void;
	/** Canvas height. @default "10rem" */
	height?: string;
	/** Placeholder text before drawing. */
	placeholder?: string;
	/** Labels for the action buttons. */
	labels?: { clear?: string; undo?: string };
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	disabled?: boolean;
}

export function SignaturePad(props: SignaturePadProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"onEnd",
		"onChange",
		"onStrokeStart",
		"strokeColor",
		"penColor",
		"strokeWidth",
		"penWidth",
		"clearable",
		"undoable",
		"onClear",
		"onUndo",
		"height",
		"placeholder",
		"labels",
		"variant",
		"radius",
		"elevation",
		"disabled",
	]);
	let canvas!: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let drawing = false;
	const [empty, setEmpty] = createSignal(true);
	const [history, setHistory] = createSignal<ImageData[]>([]);
	let ratio = 1;

	const pen = () => local.strokeColor ?? local.penColor ?? "currentColor";
	const penW = () => local.strokeWidth ?? local.penWidth ?? 2.5;

	onMount(() => {
		ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			ratio = window.devicePixelRatio || 1;
			canvas.width = rect.width * ratio;
			canvas.height = rect.height * ratio;
			ctx?.scale(ratio, ratio);
			setHistory([]);
			setEmpty(true);
		};
		resize();
		window.addEventListener("resize", resize);
		onCleanup(() => window.removeEventListener("resize", resize));
	});

	const point = (e: PointerEvent) => {
		const rect = canvas.getBoundingClientRect();
		return { x: e.clientX - rect.left, y: e.clientY - rect.top };
	};
	const snapshot = () => {
		const c = ctx;
		if (!c || !local.undoable) return;
		try {
			const data = c.getImageData(0, 0, canvas.width, canvas.height);
			setHistory((h) => [...h.slice(-19), data]);
		} catch {
			/* getImageData unavailable (e.g. jsdom) */
		}
	};
	const down = (e: PointerEvent) => {
		if (local.disabled || !ctx) return;
		drawing = true;
		canvas.setPointerCapture(e.pointerId);
		snapshot();
		local.onStrokeStart?.();
		const p = point(e);
		ctx.beginPath();
		ctx.moveTo(p.x, p.y);
	};
	const move = (e: PointerEvent) => {
		if (!drawing || !ctx) return;
		const p = point(e);
		ctx.strokeStyle = pen();
		ctx.lineWidth = penW();
		ctx.lineTo(p.x, p.y);
		ctx.stroke();
		setEmpty(false);
	};
	const up = () => {
		if (!drawing) return;
		drawing = false;
		if (!empty()) {
			const url = canvas.toDataURL("image/png");
			local.onEnd?.(url);
			local.onChange?.(url);
		}
	};
	const clear = () => {
		ctx?.clearRect(0, 0, canvas.width, canvas.height);
		setHistory([]);
		setEmpty(true);
		local.onClear?.();
	};
	const undo = () => {
		const h = history();
		const last = h[h.length - 1];
		if (!ctx || !last) return;
		try {
			ctx.putImageData(last, 0, 0);
		} catch {
			return;
		}
		const next = h.slice(0, -1);
		setHistory(next);
		setEmpty(next.length === 0);
		local.onUndo?.(next.length);
	};

	const actionBtn = (label: string, fn: () => void, extraClass = "") => (
		<button
			type="button"
			class={`rounded-md border border-border bg-surface/80 px-2 py-1 text-2xs font-medium text-muted-foreground backdrop-blur motion-safe:transition-colors motion-reduce:transition-none hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-40 ${extraClass}`}
			onClick={fn}
		>
			{label}
		</button>
	);

	return (
		<div
			class={`solidui-signature-pad relative overflow-hidden ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<canvas
				ref={canvas}
				class={`block w-full touch-none text-foreground ${local.disabled ? "opacity-50" : "cursor-crosshair"}`}
				style={{ height: local.height ?? "10rem" }}
				role="img"
				aria-label={local.placeholder ?? "Signature pad"}
				onPointerDown={down}
				onPointerMove={move}
				onPointerUp={up}
				onPointerLeave={up}
			/>
			<Show when={local.placeholder && empty()}>
				<span class="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground/50">
					{local.placeholder}
				</span>
			</Show>
			<Show when={!local.disabled}>
				<div class="absolute right-2 top-2 flex gap-1">
					<Show when={local.undoable}>{actionBtn(local.labels?.undo ?? "Undo", undo)}</Show>
					<Show when={local.clearable ?? true}>{actionBtn(local.labels?.clear ?? "Clear", clear)}</Show>
				</div>
			</Show>
		</div>
	);
}
