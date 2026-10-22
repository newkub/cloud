/**
 * Use case: Motion Capture
 * Captures motion from mouse, touch, or webcam
 */

import { MotionCapture } from "../../../domain/models/input-media/motion-capture";
import type { MotionCaptureOptions } from "../../../types/index";

export function createMotionCapture(options: MotionCaptureOptions = {}) {
	const motionCapture = new MotionCapture(options);

	return {
		startCapture: () => {
			motionCapture.startCapture();
		},
		stopCapture: () => {
			motionCapture.stopCapture();
		},
		getMotionData: () => {
			return motionCapture.getMotionData();
		},
		getLatestMotionData: () => {
			return motionCapture.getLatestMotionData();
		},
		clearMotionData: () => {
			motionCapture.clearMotionData();
		},
		dispose: () => {
			motionCapture.dispose();
		},
	};
}
