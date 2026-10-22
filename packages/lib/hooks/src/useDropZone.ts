import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface DropZoneState {
	/** True while a drag hovers over the element */
	over: Accessor<boolean>;
	/** Files from the most recent drop */
	dropped: Accessor<File[]>;
}

/**
 * File drag/drop zone — `over` tracks dragenter/dragleave and `dropped`
 * holds the `File[]` from the last drop. `dragover`/`drop` defaults are
 * prevented so drops are accepted. Rebinds when the target changes. SSR-safe.
 *
 * @param target — Element or accessor resolving to one
 * @param options — `onDrop` callback fired with the dropped files
 * @returns `{ over, dropped }` accessors
 *
 * @example
 * let zone!: HTMLDivElement;
 * const dz = useDropZone(() => zone);
 * <div ref={zone}>{dz.over() ? "release!" : "drop files"}</div>
 */
export function useDropZone(
	target: MaybeAccessor<HTMLElement | undefined>,
	options?: {
		/** Fired with the dropped files on `drop`. */
		onDrop?: (files: File[], e: DragEvent) => void;
	},
): DropZoneState {
	const [over, setOver] = createSignal(false);
	const [dropped, setDropped] = createSignal<File[]>([]);

	createEffect(() => {
		const el = read(target);
		if (!el || typeof window === "undefined") return;

		let depth = 0;

		const onDragEnter = (e: DragEvent) => {
			e.preventDefault();
			depth += 1;
			setOver(true);
		};

		const onDragOver = (e: DragEvent) => {
			e.preventDefault();
		};

		const onDragLeave = (e: DragEvent) => {
			e.preventDefault();
			depth = Math.max(0, depth - 1);
			if (depth === 0) setOver(false);
		};

		const onDrop = (e: DragEvent) => {
			e.preventDefault();
			depth = 0;
			setOver(false);
			const files = Array.from(e.dataTransfer?.files ?? []);
			setDropped(files);
			options?.onDrop?.(files, e);
		};

		el.addEventListener("dragenter", onDragEnter);
		el.addEventListener("dragover", onDragOver);
		el.addEventListener("dragleave", onDragLeave);
		el.addEventListener("drop", onDrop);
		onCleanup(() => {
			el.removeEventListener("dragenter", onDragEnter);
			el.removeEventListener("dragover", onDragOver);
			el.removeEventListener("dragleave", onDragLeave);
			el.removeEventListener("drop", onDrop);
			setOver(false);
		});
	});

	return { over, dropped };
}
