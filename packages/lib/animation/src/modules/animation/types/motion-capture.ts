/**
 * Motion Capture types
 */

export interface MotionCaptureOptions {
	sensorType?: "mouse" | "touch" | "webcam";
	smoothing?: number;
	sensitivity?: number;
}

export interface MotionData {
	x: number;
	y: number;
	z?: number;
	rotation?: number;
	timestamp: number;
}
