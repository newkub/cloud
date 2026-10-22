import { createSignal, type JSX, onCleanup, splitProps, useContext } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
import { ResizableContext, type ResizableContextValue } from "./context";

export interface ResizableHandleProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Corner radius. */ radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

function useResizableDrag(ctx: ResizableContextValue, index: number) {
	const [dragging, setDragging] = createSignal(false);
	let startPos = 0;
	let startSizes: [number, number] = [50, 50];

	const containerSize = () => {
		const el = ctx.container();
		if (!el) return 0;
		return ctx.direction() === "vertical" ? el.getBoundingClientRect().height : el.getBoundingClientRect().width;
	};

	const onPointerMove = (e: PointerEvent) => {
		const pos = ctx.direction() === "vertical" ? e.clientY : e.clientX;
		const delta = pos - startPos;
		const size = containerSize();
		if (!size) return;
		const deltaPercent = (delta / size) * 100;
		const next0 = Math.max(0, Math.min(100, startSizes[0] + deltaPercent));
		const next1 = 100 - next0;
		ctx.setSizeAt(index, next0);
		ctx.setSizeAt(index + 1, next1);
	};

	const onPointerUp = () => {
		setDragging(false);
		window.removeEventListener("pointermove", onPointerMove);
		window.removeEventListener("pointerup", onPointerUp);
		ctx.onResize?.(ctx.sizes());
	};

	onCleanup(() => {
		window.removeEventListener("pointermove", onPointerMove);
		window.removeEventListener("pointerup", onPointerUp);
	});

	const onPointerDown = (e: PointerEvent) => {
		e.preventDefault();
		setDragging(true);
		startPos = ctx.direction() === "vertical" ? e.clientY : e.clientX;
		startSizes = [ctx.sizes()[index] ?? 50, ctx.sizes()[index + 1] ?? 50];
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);
	};

	return { dragging, onPointerDown };
}

export function ResizableHandle(props: ResizableHandleProps) {
	const ctx = useContext(ResizableContext);
	if (!ctx) {
		throw new Error("ResizableHandle must be used inside a Resizable.");
	}

	const [local, rest] = splitProps(props, ["class", "onKeyDown", "radius", "elevation"]);
	const index = ctx.getHandleIndex();
	const { dragging, onPointerDown } = useResizableDrag(ctx, index);
	const isVertical = () => ctx.direction() === "vertical";

	const onKeyDown = (e: KeyboardEvent) => {
		if (typeof local.onKeyDown === "function") {
			(local.onKeyDown as (e: KeyboardEvent) => void)(e);
		}
		if (e.defaultPrevented) return;
		const step = e.shiftKey ? 10 : 2;
		const keys: Record<string, number> = isVertical()
			? { ArrowUp: -1, ArrowDown: 1 }
			: { ArrowLeft: -1, ArrowRight: 1 };
		const dir = keys[e.key];
		if (!dir) return;
		e.preventDefault();
		const first = ctx.sizes()[index] ?? 50;
		const next = Math.max(0, Math.min(100, first + dir * step));
		ctx.setSizeAt(index, next);
		ctx.setSizeAt(index + 1, 100 - next);
		ctx.onResize?.(ctx.sizes());
	};

	const className = () => {
		const base = isVertical()
			? "relative h-1.5 w-full cursor-row-resize rounded-full bg-border transition-colors hover:bg-primary after:absolute after:-inset-y-2 after:inset-x-0 after:content-['']"
			: "relative h-full w-1.5 cursor-col-resize rounded-full bg-border transition-colors hover:bg-primary after:absolute after:inset-y-0 after:-inset-x-2 after:content-['']";
		return [
			base,
			"focus-visible:outline-none focus-visible:bg-primary",
			dragging() ? "bg-primary" : "",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	};

	return (
		// biome-ignore lint/a11y/useSemanticElements: APG resize handle uses button with separator role for keyboard support
		<button
			type="button"
			role="separator"
			aria-orientation={isVertical() ? "horizontal" : "vertical"}
			aria-valuenow={Math.round(ctx.sizes()[index] ?? 50)}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label="Resize panels"
			class={className()}
			onPointerDown={onPointerDown}
			onKeyDown={onKeyDown}
			{...rest}
		/>
	);
}
