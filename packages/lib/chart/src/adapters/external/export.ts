// Chart export utilities for PNG, SVG, and PDF formats
// Clean Architecture: Infrastructure layer for external integrations

export interface ExportOptions {
	filename?: string;
	quality?: number;
	scale?: number;
	backgroundColor?: string;
}

export interface ExportResult {
	success: boolean;
	dataUrl?: string;
	error?: string;
}

/**
 * Export chart as PNG using canvas
 */
export async function exportAsPNG(element: HTMLElement, options: ExportOptions = {}): Promise<ExportResult> {
	try {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			return { success: false, error: "Failed to create canvas context" };
		}

		const scale = options.scale ?? 2;
		const rect = element.getBoundingClientRect();

		canvas.width = rect.width * scale;
		canvas.height = rect.height * scale;
		ctx.scale(scale, scale);

		// Fill background
		if (options.backgroundColor) {
			ctx.fillStyle = options.backgroundColor;
			ctx.fillRect(0, 0, rect.width, rect.height);
		}

		// Get SVG element and convert to image
		const svgElement = element.querySelector("svg");
		if (!svgElement) {
			return { success: false, error: "No SVG element found" };
		}

		const svgData = new XMLSerializer().serializeToString(svgElement);
		const svgBlob = new Blob([svgData], {
			type: "image/svg+xml;charset=utf-8",
		});
		const url = URL.createObjectURL(svgBlob);

		const img = new Image();
		img.onload = () => {
			ctx.drawImage(img, 0, 0, rect.width, rect.height);
			URL.revokeObjectURL(url);

			const dataUrl = canvas.toDataURL("image/png", options.quality ?? 1);
			downloadFile(dataUrl, options.filename ?? "chart.png");
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			return { success: false, error: "Failed to load SVG as image" };
		};

		img.src = url;

		return {
			success: true,
			dataUrl: canvas.toDataURL("image/png", options.quality ?? 1),
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Export chart as SVG
 */
export async function exportAsSVG(element: HTMLElement, options: ExportOptions = {}): Promise<ExportResult> {
	try {
		const svgElement = element.querySelector("svg");
		if (!svgElement) {
			return { success: false, error: "No SVG element found" };
		}

		// Clone SVG to avoid modifying the original
		const svgClone = svgElement.cloneNode(true) as SVGElement;
		svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

		// Add background if specified
		if (options.backgroundColor) {
			const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			rect.setAttribute("width", "100%");
			rect.setAttribute("height", "100%");
			rect.setAttribute("fill", options.backgroundColor);
			svgClone.insertBefore(rect, svgClone.firstChild);
		}

		const svgData = new XMLSerializer().serializeToString(svgClone);
		const svgBlob = new Blob([svgData], {
			type: "image/svg+xml;charset=utf-8",
		});
		const url = URL.createObjectURL(svgBlob);

		downloadFile(url, options.filename ?? "chart.svg");
		URL.revokeObjectURL(url);

		return { success: true, dataUrl: url };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Export chart as PDF (using print)
 */
export async function exportAsPDF(element: HTMLElement, options: ExportOptions = {}): Promise<ExportResult> {
	try {
		const svgElement = element.querySelector("svg");
		if (!svgElement) {
			return { success: false, error: "No SVG element found" };
		}

		// Create a new window for printing
		const printWindow = window.open("", "_blank");
		if (!printWindow) {
			return { success: false, error: "Failed to open print window" };
		}

		const svgData = new XMLSerializer().serializeToString(svgElement);
		printWindow.document.write(`
			<!DOCTYPE html>
			<html>
				<head>
					<title>${options.filename ?? "Chart"}</title>
					<style>
						body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
						svg { max-width: 100%; height: auto; }
					</style>
				</head>
				<body>
					${svgData}
				</body>
			</html>
		`);
		printWindow.document.close();

		// Trigger print dialog
		printWindow.print();

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Download file from data URL
 */
function downloadFile(dataUrl: string, filename: string): void {
	const link = document.createElement("a");
	link.href = dataUrl;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

/**
 * Export chart with format selection
 */
export async function exportChart(
	element: HTMLElement,
	format: "png" | "svg" | "pdf",
	options: ExportOptions = {},
): Promise<ExportResult> {
	switch (format) {
		case "png":
			return exportAsPNG(element, options);
		case "svg":
			return exportAsSVG(element, options);
		case "pdf":
			return exportAsPDF(element, options);
		default:
			return { success: false, error: "Unsupported format" };
	}
}
