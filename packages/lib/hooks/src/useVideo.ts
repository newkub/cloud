import type { Accessor } from "solid-js";
import { createMediaControls, type MediaControls } from "./useAudio";
import type { MaybeAccessor } from "./useEventListener";
import { type PictureInPictureState, usePictureInPicture } from "./usePictureInPicture";

export interface VideoControls extends MediaControls {
	/** Picture-in-Picture controls for the same element */
	pip: PictureInPictureState;
}

/**
 * Playback controls for a `<video>` element — everything `useAudio` returns
 * plus a `pip` group (`active`, `enter`, `exit`, `supported`).
 *
 * @param video — Video element or accessor resolving to one
 * @returns `{ playing, currentTime, duration, volume, ended, play, pause, seek, setVolume, pip }`
 *
 * @example
 * let el!: HTMLVideoElement;
 * const v = useVideo(() => el);
 * <video ref={el} src="/clip.mp4" muted />
 * <button onClick={() => v.pip.enter()} disabled={!v.pip.supported}>mini player</button>
 */
export function useVideo(video: MaybeAccessor<HTMLVideoElement | undefined>): VideoControls {
	const el: Accessor<HTMLVideoElement | undefined> = () => (typeof video === "function" ? video() : video);
	return { ...createMediaControls(el), pip: usePictureInPicture(video) };
}
