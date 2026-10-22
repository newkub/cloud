/**
 * SolidJS composable for Video Export
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createVideoExporter } from "../../../modules/animation/application/usecases/graphics";
import type { VideoExportOptions, VideoExportProgress } from "../../../modules/animation/types";

export function useVideoExporter(options: VideoExportOptions) {
	const [videoExporter, setVideoExporter] = createSignal<ReturnType<typeof createVideoExporter> | null>(null);
	const [isRecording, setIsRecording] = createSignal(false);
	const [progress, setProgress] = createSignal<VideoExportProgress>({
		progress: 0,
		bytesWritten: 0,
		isComplete: false,
	});

	const createExporterInstance = () => {
		const ve = createVideoExporter(options);
		setVideoExporter(ve);
		return ve;
	};

	const startRecording = (onProgress?: (progress: VideoExportProgress) => void) => {
		const ve = videoExporter() || createExporterInstance();
		ve.startRecording((p) => {
			setProgress(p);
			if (onProgress) {
				onProgress(p);
			}
		});
		setIsRecording(true);
	};

	const stopRecording = () => {
		const ve = videoExporter();
		if (ve) {
			ve.stopRecording();
			setIsRecording(false);
		}
	};

	const exportVideo = async () => {
		const ve = videoExporter();
		if (ve) {
			return await ve.export();
		}
		return new Blob();
	};

	const download = (filename?: string) => {
		const ve = videoExporter();
		if (ve) {
			ve.download(filename);
		}
	};

	// Auto-update progress while recording
	createEffect(() => {
		if (isRecording()) {
			const interval = setInterval(() => {
				const ve = videoExporter();
				if (ve) {
					setProgress(ve.getProgress());
				}
			}, 100);

			onCleanup(() => {
				clearInterval(interval);
			});
		}
	});

	// Auto-create instance on mount
	createEffect(() => {
		const instance = createExporterInstance();
		onCleanup(() => {
			instance?.dispose();
		});
	});

	return {
		startRecording,
		stopRecording,
		export: exportVideo,
		download,
		progress,
		isRecording,
		videoExporter,
	};
}
