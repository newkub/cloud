import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface RtcState {
	/** The underlying peer connection — `undefined` when WebRTC is unsupported */
	connection: Accessor<RTCPeerConnection | undefined>;
	/** First remote `MediaStream` seen on a `track` event */
	remoteStream: Accessor<MediaStream | undefined>;
	/** `connectionState` mirrored as a signal — `"unavailable"` without WebRTC */
	state: Accessor<RTCPeerConnectionState | "unavailable">;
	/** `pc.createOffer()` + `setLocalDescription` — resolves `undefined` when unsupported */
	createOffer: () => Promise<RTCSessionDescriptionInit | undefined>;
	/** `pc.createAnswer()` + `setLocalDescription` — resolves `undefined` when unsupported */
	createAnswer: () => Promise<RTCSessionDescriptionInit | undefined>;
	/** Apply a remote offer/answer description — no-op when unsupported */
	setRemote: (description: RTCSessionDescriptionInit) => Promise<void>;
	/** Add a remote ICE candidate — no-op when unsupported */
	addIce: (candidate: RTCIceCandidateInit | null) => Promise<void>;
	/** Close the connection and drop the remote stream */
	close: () => void;
}

/**
 * Thin signal wrapper around `RTCPeerConnection` — `state` tracks
 * `connectionstatechange` and `remoteStream` captures the first stream from
 * `track` events. The connection is created eagerly when the API exists and
 * closed on cleanup. SSR/jsdom-safe: every method no-ops when
 * `RTCPeerConnection` is unavailable.
 *
 * @param config — Optional `RTCConfiguration` (ICE servers, etc.)
 * @returns `{ connection, remoteStream, state, createOffer, createAnswer, setRemote, addIce, close }`
 *
 * @example
 * const rtc = useRtc({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
 * const offer = await rtc.createOffer();
 * <video srcObject={rtc.remoteStream()} autoplay />
 */
export function useRtc(config?: RTCConfiguration): RtcState {
	const [connection, setConnection] = createSignal<RTCPeerConnection>();
	const [remoteStream, setRemoteStream] = createSignal<MediaStream>();
	const [state, setState] = createSignal<RTCPeerConnectionState | "unavailable">("new");

	let pc: RTCPeerConnection | undefined;
	if (typeof RTCPeerConnection !== "undefined") {
		pc = new RTCPeerConnection(config);
		const peer = pc;
		setConnection(peer);
		setState(peer.connectionState);
		const onState = () => setState(peer.connectionState);
		const onTrack = (e: RTCTrackEvent) => {
			const stream = e.streams?.[0];
			if (stream) setRemoteStream(() => stream);
		};
		peer.addEventListener("connectionstatechange", onState);
		peer.addEventListener("track", onTrack);
		onCleanup(() => {
			peer.removeEventListener("connectionstatechange", onState);
			peer.removeEventListener("track", onTrack);
			peer.close();
		});
	} else {
		setState("unavailable");
	}

	return {
		connection,
		remoteStream,
		state,
		createOffer: async () => {
			if (!pc) return undefined;
			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
			return offer;
		},
		createAnswer: async () => {
			if (!pc) return undefined;
			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);
			return answer;
		},
		setRemote: async (description) => {
			await pc?.setRemoteDescription(description);
		},
		addIce: async (candidate) => {
			await pc?.addIceCandidate(candidate ?? undefined);
		},
		close: () => {
			pc?.close();
			setRemoteStream(undefined);
			setState(pc ? pc.connectionState : "unavailable");
		},
	};
}
