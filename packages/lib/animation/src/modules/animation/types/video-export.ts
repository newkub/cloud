/**
 * Export to Video Types
 */

export interface VideoExportOptions {
	canvas: HTMLCanvasElement;
	fps?: number;
	duration?: number;
	quality?: number;
	mimeType?: string;
}

export interface VideoExportProgress {
	progress: number;
	bytesWritten: number;
	isComplete: boolean;
}
