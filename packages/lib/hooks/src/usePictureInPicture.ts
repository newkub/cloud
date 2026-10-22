import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface PictureInPictureState {
	/** True while the video is floating in the PiP window */
	active: Accessor<boolean>;
	/** Whether the Picture-in-Picture API is available */
	supported: boolean;
	/** Float the video — resolves once the PiP window opens */
	enter: () => Promise<void>;
	/** Return the video to the page */
	exit: () => Promise<void>;
}

/**
 * Picture-in-Picture for a `<video>` element — tracks
 * `enterpictureinpicture`/`leavepictureinpicture` so `active()` stays in sync
 * even when the user toggles PiP from the native controls.
 *
 * @param video — Video element or accessor resolving to one
 * @returns `{ active, supported, enter, exit }`
 *
 * @example
 * let el!: HTMLVideoElement;
 * const pip = usePictureInPicture(() => el);
 * <video ref={el} src="/clip.mp4" />
 * <Show when={pip.supported}><button onClick={pip.enter}>pop out</button></Show>
 */
export function usePictureInPicture(video: MaybeAccessor<HTMLVideoElement | undefined>): PictureInPictureState {
	const [active, setActive] = createSignal(false);
	const supported =
		typeof document !== "undefined" &&
		"pictureInPictureEnabled" in document &&
		typeof HTMLVideoElement !== "undefined" &&
		"requestPictureInPicture" in HTMLVideoElement.prototype;

	createEffect(() => {
		const el = resolve(video);
		if (!el) return;
		const onEnter = () => setActive(true);
		const onLeave = () => setActive(false);
		el.addEventListener("enterpictureinpicture", onEnter);
		el.addEventListener("leavepictureinpicture", onLeave);
		setActive(document.pictureInPictureElement === el);
		onCleanup(() => {
			el.removeEventListener("enterpictureinpicture", onEnter);
			el.removeEventListener("leavepictureinpicture", onLeave);
		});
	});

	return {
		active,
		supported,
		enter: async () => {
			await resolve(video)?.requestPictureInPicture();
		},
		exit: async () => {
			if (typeof document !== "undefined" && document.pictureInPictureElement) {
				await document.exitPictureInPicture();
			}
		},
	};
}
