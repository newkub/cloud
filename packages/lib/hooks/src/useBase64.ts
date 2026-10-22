import { type Accessor, createEffect, createSignal } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export type Base64Source = string | Blob | File | MediaSource | HTMLElement;

export interface UseBase64Options {
	/** MIME type used to wrap string output in a `data:` URL. When omitted, strings encode to raw base64. */
	mime_type?: string;
	/** Custom encoder for string bytes. @default base64 via `btoa` */
	encoder?: (buffer: ArrayBuffer) => string;
	/** When the accessor recomputes: `"sync"` (default) for immediate, `"promise"`/`"raf"` to defer. */
	flush?: "sync" | "promise" | "raf";
}

/**
 * Reactive base64 encoding for a string, `Blob`/`File`, `MediaSource` or HTML
 * element. Strings encode synchronously (raw base64, or a `data:` URL when
 * `mime_type` is set); blobs use `FileReader`; elements use the SVG
 * `foreignObject` → `canvas` pipeline (best-effort — empty string when canvas
 * is unavailable). The returned accessor re-encodes whenever the source
 * changes and never throws for unsupported inputs.
 *
 * @param source — Value (or accessor); `null`/`undefined` clears to `""`.
 * @param options — See {@link UseBase64Options}
 * @returns `Accessor<string>` holding the encoded result
 *
 * @example
 * const b64 = useBase64("hello");
 * <Show when={b64()}>{b64()}</Show>
 *
 * const dataUrl = useBase64(fileInputRef, { mime_type: "image/png" });
 */
export function useBase64(
	source?: MaybeAccessor<Base64Source | null | undefined>,
	options?: UseBase64Options,
): Accessor<string> {
	const [base64, setBase64] = createSignal("");
	const flush = options?.flush ?? "sync";
	const mime = options?.mime_type;
	const encoder = options?.encoder;

	const commit = (value: string) => {
		if (flush === "raf" && typeof requestAnimationFrame === "function") requestAnimationFrame(() => setBase64(value));
		else if (flush === "promise") Promise.resolve().then(() => setBase64(value));
		else setBase64(value);
	};

	const encodeString = (str: string) => {
		const bytes = new TextEncoder().encode(str);
		const view = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
		const b64 = encoder ? encoder(view) : bytesToBase64(bytes);
		return mime ? `data:${mime};base64,${b64}` : b64;
	};

	const readFile = (blob: Blob) => {
		if (typeof FileReader === "undefined") {
			commit("");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => commit(typeof reader.result === "string" ? reader.result : "");
		reader.onerror = () => commit("");
		reader.readAsDataURL(blob);
	};

	const renderElement = (el: HTMLElement) => {
		try {
			const width = el.offsetWidth || 1;
			const height = el.offsetHeight || 1;
			const markup = new XMLSerializer().serializeToString(el);
			const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%">${markup}</foreignObject></svg>`;
			const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
			const img = new Image();
			img.onload = () => {
				try {
					const canvas = document.createElement("canvas");
					canvas.width = img.width || width;
					canvas.height = img.height || height;
					const ctx = canvas.getContext("2d");
					if (!ctx) {
						commit("");
						return;
					}
					ctx.drawImage(img, 0, 0);
					commit(canvas.toDataURL());
				} catch {
					commit("");
				} finally {
					URL.revokeObjectURL(url);
				}
			};
			img.onerror = () => {
				URL.revokeObjectURL(url);
				commit("");
			};
			img.src = url;
		} catch {
			commit("");
		}
	};

	createEffect(() => {
		const value = read(source);
		if (value == null) {
			commit("");
			return;
		}
		if (typeof value === "string") {
			commit(encodeString(value));
			return;
		}
		if (typeof Blob !== "undefined" && value instanceof Blob) {
			readFile(value);
			return;
		}
		if (typeof HTMLElement !== "undefined" && value instanceof HTMLElement) {
			renderElement(value);
			return;
		}
		commit("");
	});

	return base64;
}

function bytesToBase64(bytes: Uint8Array): string {
	let binary = "";
	const chunk = 0x8000;
	for (let i = 0; i < bytes.length; i += chunk) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	}
	return btoa(binary);
}
