/**
 * Use case: Timeline Editor
 * Creates and manages timeline editing functionality
 */

import { TimelineEditor } from "../../../domain/models/advanced/timeline-editor";
import type { Keyframe, TimelineEditorOptions, TimelineTrack } from "../../../types";

export function createTimelineEditor(options: TimelineEditorOptions = {}) {
	const editor = new TimelineEditor(options);

	return {
		addTrack: (track: TimelineTrack) => {
			editor.addTrack(track);
		},
		removeTrack: (trackId: string) => {
			editor.removeTrack(trackId);
		},
		addKeyframe: (trackId: string, keyframe: Keyframe) => {
			editor.addKeyframe(trackId, keyframe);
		},
		removeKeyframe: (trackId: string, keyframeIndex: number) => {
			editor.removeKeyframe(trackId, keyframeIndex);
		},
		updateKeyframe: (trackId: string, keyframeIndex: number, keyframe: Partial<Keyframe>) => {
			editor.updateKeyframe(trackId, keyframeIndex, keyframe);
		},
		getCurrentTime: () => {
			return editor.getCurrentTime();
		},
		setCurrentTime: (time: number) => {
			editor.setCurrentTime(time);
		},
		getDuration: () => {
			return editor.getDuration();
		},
		getTracks: () => {
			return editor.getTracks();
		},
		getTrack: (trackId: string) => {
			return editor.getTrack(trackId);
		},
		play: () => {
			editor.play();
		},
		pause: () => {
			editor.pause();
		},
		stop: () => {
			editor.stop();
		},
		dispose: () => {
			editor.dispose();
		},
	};
}
