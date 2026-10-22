import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface ActivePointer {
	/** Viewport x position (`clientX`) */
	x: number;
	/** Viewport y position (`clientY`) */
	y: number;
	/** Pointer kind: `"mouse" | "pen" | "touch"` */
	type: string;
	/** Bitmask of pressed buttons */
	buttons: number;
}

export interface MultiPointerState {
	/** Live map of `pointerId → ActivePointer` for every pointer down on the target */
	pointers: Accessor<ReadonlyMap<number, ActivePointer>>;
	/** Number of active pointers */
	count: Accessor<number>;
	/** True while two or more pointers are active (pinch/gesture territory) */
	isMulti: Accessor<boolean>;
}

/**
 * Track every active pointer on an element (or window) — `pointerdown` adds an
 * entry keyed by `pointerId`, `pointermove` refreshes its position, and
 * `pointerup`/`pointercancel` remove it. The map is replaced immutably on each
 * update so `pointers()` is safe to iterate in reactive scopes.
 *
 * @param target — Element or accessor; defaults to `window` when omitted
 * @returns `{ pointers, count, isMulti }`
 *
 * @example
 * const mp = useMultiPointer(() => canvasEl());
 * <div>{mp.count()} fingers down</div>
 * <For each={[...mp.pointers().values()]}>{(p) => <Dot x={p.x} y={p.y} />}</For>
 */
export function useMultiPointer(target?: MaybeAccessor<HTMLElement | undefined>): MultiPointerState {
	const [pointers, setPointers] = createSignal<ReadonlyMap<number, ActivePointer>>(new Map());

	createEffect(() => {
		if (typeof window === "undefined") return;
		const el = resolve(target);
		const src: HTMLElement | Window = el ?? window;

		const patch = (id: number, entry: ActivePointer | undefined) =>
			setPointers((prev) => {
				const next = new Map(prev);
				if (entry === undefined) next.delete(id);
				else next.set(id, entry);
				return next;
			});

		const onDownOrMove = (e: Event) => {
			const p = e as PointerEvent;
			patch(p.pointerId, { x: p.clientX, y: p.clientY, type: p.pointerType ?? "", buttons: p.buttons ?? 0 });
		};
		const onEnd = (e: Event) => patch((e as PointerEvent).pointerId, undefined);

		src.addEventListener("pointerdown", onDownOrMove, { passive: true });
		src.addEventListener("pointermove", onDownOrMove, { passive: true });
		src.addEventListener("pointerup", onEnd, { passive: true });
		src.addEventListener("pointercancel", onEnd, { passive: true });
		onCleanup(() => {
			src.removeEventListener("pointerdown", onDownOrMove);
			src.removeEventListener("pointermove", onDownOrMove);
			src.removeEventListener("pointerup", onEnd);
			src.removeEventListener("pointercancel", onEnd);
			setPointers(new Map());
		});
	});

	return {
		pointers,
		count: () => pointers().size,
		isMulti: () => pointers().size >= 2,
	};
}
