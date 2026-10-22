/**
 * Use case: Video Export
 * Handles canvas recording and video export
 */

import { VideoExporter } from "../../../domain/models/graphics/index";
import type { VideoExportOptions, VideoExportProgress } from "../../../types/index";

export function createVideoExporter(options: VideoExportOptions) {
	const videoExporter = new VideoExporter(options);

	return {
		startRecording: (onProgress?: (progress: VideoExportProgress) => void) => {
			videoExporter.startRecording(onProgress);
		},
		stopRecording: () => {
			videoExporter.stopRecording();
		},
		export: () => {
			return videoExporter.export();
		},
		download: (filename?: string) => {
			videoExporter.download(filename);
		},
		getProgress: () => {
			return videoExporter.getProgress();
		},
		dispose: () => {
			videoExporter.dispose();
		},
	};
}
