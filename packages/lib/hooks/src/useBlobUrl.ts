import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface BlobUrlState {
	/** Object URL for the current blob — `undefined` when the blob is empty or `URL.createObjectURL` is missing */
	url: Accessor<string | undefined>;
}

/**
 * Object URL lifecycle for a reactive `Blob` — creates
 * `URL.createObjectURL(blob)` whenever the source changes and revokes the
 * previous URL, so only one URL is alive at a time. The last URL is revoked
 * on cleanup. `url()` stays `undefined` where `URL.createObjectURL` is
 * unavailable (SSR, some test environments).
 *
 * @param blob — Blob/File or accessor resolving to one (`null`/`undefined` clears the URL)
 * @returns `{ url }`
 *
 * @example
 * const [file, setFile] = createSignal<Blob>();
 * const { url } = useBlobUrl(file);
 * <img src={url()} />
 */
export function useBlobUrl(blob: MaybeAccessor<Blob | null | undefined>): BlobUrlState {
	const [url, setUrl] = createSignal<string>();

	createEffect(() => {
		const b = read(blob);
		let objectUrl: string | undefined;
		if (b && typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
			objectUrl = URL.createObjectURL(b);
		}
		setUrl(objectUrl);
		onCleanup(() => {
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		});
	});

	return { url };
}
