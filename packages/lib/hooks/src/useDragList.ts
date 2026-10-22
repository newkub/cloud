import { type Accessor, createSignal } from "solid-js";

export interface DragListControls<T> {
	/** Reactive snapshot of the list in current order */
	items: Accessor<T[]>;
	/** Move the item at `from` to `to` — indexes clamped to the list */
	move: (from: number, to: number) => void;
	/** Index of the item currently being dragged, or null */
	dragging: Accessor<number | null>;
	/** `onDragStart` handler factory for the item at `index` */
	onDragStart: (index: number) => (event: DragEvent) => void;
	/** `onDragOver` handler factory for the item at `index` — reorders live */
	onDragOver: (index: number) => (event: DragEvent) => void;
	/** `onDragEnd` handler factory — clears `dragging` */
	onDragEnd: () => (event: DragEvent) => void;
}

/**
 * HTML5 drag-reorder state — `dragging` tracks the source index while
 * `onDragOver` live-moves the item under the pointer. Bind the handler
 * factories per row: `onDragStart={d.onDragStart(i())}`.
 *
 * @param initial — Seed values. @default empty
 * @returns `{ items, move, dragging, onDragStart, onDragOver, onDragEnd }`
 *
 * @example
 * const d = useDragList(["a", "b", "c"]);
 * <For each={d.items()}>
 *   {(item, i) => (
 *     <li draggable onDragStart={d.onDragStart(i())} onDragOver={d.onDragOver(i())} onDragEnd={d.onDragEnd()}>
 *       {item}
 *     </li>
 *   )}
 * </For>
 */
export function useDragList<T>(initial?: Iterable<T>): DragListControls<T> {
	const [items, setItems] = createSignal<T[]>([...(initial ?? [])]);
	const [dragging, setDragging] = createSignal<number | null>(null);

	const move = (from: number, to: number) =>
		setItems((l) => {
			if (from < 0 || from >= l.length) return l;
			const i = Math.max(0, Math.min(to, l.length - 1));
			if (i === from) return l;
			const next = [...l];
			const [value] = next.splice(from, 1);
			next.splice(i, 0, value as T);
			return next;
		});

	return {
		items,
		move,
		dragging,
		onDragStart: (index) => (event) => {
			setDragging(index);
			if (event.dataTransfer) {
				event.dataTransfer.effectAllowed = "move";
				event.dataTransfer.setData("text/plain", String(index));
			}
		},
		onDragOver: (index) => (event) => {
			event.preventDefault();
			if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
			const from = dragging();
			if (from === null || from === index) return;
			move(from, index);
			setDragging(index);
		},
		onDragEnd: () => () => setDragging(null),
	};
}
