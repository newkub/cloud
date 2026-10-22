import { type Accessor, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface ClipboardImageState {
	/** Most recently pasted image — `null` until the first successful paste */
	image: Accessor<Blob | null>;
	/**
	 * Attach a `paste` listener to `target` (defaults to `document`) — returns
	 * an unbind function. When the event carries no usable `clipboardData`,
	 * falls back to `navigator.clipboard.read()`.
	 */
	onPaste: (target?: MaybeAccessor<HTMLElement | Document | Window | undefined>) => () => void;
	/** Reset `image` back to `null` */
	clear: () => void;
}

const imageFromClipboardData = (data: DataTransfer | null): Blob | null => {
	if (!data) return null;
	const items = data.items ?? [];
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		if (item && item.kind === "file" && item.type.startsWith("image/")) {
			const file = item.getAsFile();
			if (file) return file;
		}
	}
	return null;
};

const imageFromClipboardApi = async (): Promise<Blob | null> => {
	const clipboard = typeof navigator !== "undefined" ? navigator.clipboard : undefined;
	if (!clipboard || typeof clipboard.read !== "function") return null;
	try {
		const items = await clipboard.read();
		for (const item of items) {
			const type = item.types.find((t) => t.startsWith("image/"));
			if (type) return await item.getType(type);
		}
	} catch {
		// permission denied or empty clipboard — treat as no image
	}
	return null;
};

/**
 * Capture pasted images — `onPaste()` binds a `paste` listener that pulls
 * the first `image/*` item out of `clipboardData`, falling back to the async
 * `navigator.clipboard.read()` API when the event exposes nothing.
 * SSR/jsdom-safe: every path feature-detects.
 *
 * @returns `{ image, onPaste, clear }`
 *
 * @example
 * const { image, onPaste } = useClipboardImage();
 * onMount(() => onPaste(() => editor()));
 * <img src={image() ? URL.createObjectURL(image()!) : placeholder} />
 */
export function useClipboardImage(): ClipboardImageState {
	const [image, setImage] = createSignal<Blob | null>(null);
	const unbinds = new Set<() => void>();

	const handle = (e: Event) => {
		const direct = imageFromClipboardData((e as ClipboardEvent).clipboardData ?? null);
		if (direct) {
			setImage(direct);
			return;
		}
		void imageFromClipboardApi().then((blob) => {
			if (blob) setImage(blob);
		});
	};

	onCleanup(() => {
		for (const unbind of unbinds) unbind();
		unbinds.clear();
	});

	return {
		image,
		onPaste: (target) => {
			if (typeof document === "undefined") return () => {};
			const el = target === undefined ? document : read(target);
			if (!el) return () => {};
			el.addEventListener("paste", handle);
			const unbind = () => {
				el.removeEventListener("paste", handle);
				unbinds.delete(unbind);
			};
			unbinds.add(unbind);
			return unbind;
		},
		clear: () => setImage(null),
	};
}
