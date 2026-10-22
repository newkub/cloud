/**
 * SolidJS composable for Motion Capture
 */

import { createEffect, createSignal, onCleanup } from "solid-js";
import { createMotionCapture } from "../../../modules/animation/application/usecases/input-media/use-motion-capture";
import type { MotionCaptureOptions, MotionData } from "../../../modules/animation/types";

export function useMotionCapture(options: MotionCaptureOptions = {}) {
	const [motionCapture, setMotionCapture] = createSignal<ReturnType<typeof createMotionCapture> | null>(null);
	const [isCapturing, setIsCapturing] = createSignal(false);
	const [motionData, setMotionData] = createSignal<MotionData[]>([]);
	const [latestData, setLatestData] = createSignal<MotionData | null>(null);

	const createCaptureInstance = () => {
		const mc = createMotionCapture(options);
		setMotionCapture(mc);
		return mc;
	};

	const startCapture = () => {
		const mc = motionCapture() || createCaptureInstance();
		mc.startCapture();
		setIsCapturing(true);
	};

	const stopCapture = () => {
		const mc = motionCapture();
		if (mc) {
			mc.stopCapture();
			setIsCapturing(false);
		}
	};

	const getMotionDataHandler = () => {
		const mc = motionCapture();
		if (mc) {
			const data = mc.getMotionData();
			setMotionData(data);
			return data;
		}
		return [];
	};

	const getLatestMotionDataHandler = () => {
		const mc = motionCapture();
		if (mc) {
			const data = mc.getLatestMotionData();
			setLatestData(data);
			return data;
		}
		return null;
	};

	const clearMotionData = () => {
		const mc = motionCapture();
		if (mc) {
			mc.clearMotionData();
			setMotionData([]);
			setLatestData(null);
		}
	};

	// Auto-update motion data while capturing
	createEffect(() => {
		if (isCapturing()) {
			const interval = setInterval(() => {
				getMotionDataHandler();
				getLatestMotionDataHandler();
			}, 16); // ~60fps

			onCleanup(() => {
				clearInterval(interval);
			});
		}
	});

	// Auto-create instance on mount
	createEffect(() => {
		const instance = createCaptureInstance();
		onCleanup(() => {
			instance?.dispose();
		});
	});

	return {
		startCapture,
		stopCapture,
		getMotionData: getMotionDataHandler,
		getLatestMotionData: getLatestMotionDataHandler,
		clearMotionData,
		isCapturing,
		motionData,
		latestData,
		motionCapture,
	};
}
