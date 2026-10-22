// Accessibility utilities for WCAG compliance
// Clean Architecture: Shared kernel utilities

export interface AccessibilityProps {
	"aria-label"?: string;
	"aria-labelledby"?: string;
	"aria-describedby"?: string;
	"aria-hidden"?: boolean;
	role?: string;
	tabIndex?: number;
}

/**
 * Generate ARIA label for chart based on type and data
 */
export function generateChartLabel(chartType: string, dataLabel?: string): string {
	const typeLabel = chartType.charAt(0).toUpperCase() + chartType.slice(1);
	return dataLabel ? `${typeLabel} chart showing ${dataLabel}` : `${typeLabel} chart`;
}

/**
 * Generate ARIA description for chart data
 */
export function generateChartDescription(data: readonly number[], labels?: readonly string[]): string {
	if (data.length === 0) return "No data available";

	const summary =
		data.length > 10
			? `${data.length} data points`
			: data
					.map((value, index) => {
						const label = labels?.[index] ?? `Point ${index + 1}`;
						return `${label}: ${value}`;
					})
					.join(", ");

	return `Data: ${summary}`;
}

/**
 * Generate ARIA label for data point
 */
export function generateDataPointLabel(value: number, label?: string, index?: number): string {
	const pointLabel = label ?? `Data point ${index ? index + 1 : ""}`;
	return `${pointLabel}: ${value}`;
}

/**
 * Check if element is keyboard navigable
 */
export function isKeyboardNavigable(element: HTMLElement): boolean {
	const tabIndex = element.tabIndex;
	return tabIndex !== undefined && tabIndex >= 0;
}

/**
 * Handle keyboard navigation for chart elements
 */
export function handleKeyboardNavigation(event: KeyboardEvent, onSelect?: () => void, onEscape?: () => void): void {
	switch (event.key) {
		case "Enter":
		case " ":
			event.preventDefault();
			onSelect?.();
			break;
		case "Escape":
			event.preventDefault();
			onEscape?.();
			break;
		case "ArrowUp":
		case "ArrowDown":
		case "ArrowLeft":
		case "ArrowRight":
			// Let default navigation work
			break;
	}
}

/**
 * Generate unique ID for accessibility
 */
export function generateAriaId(prefix: string, random: () => number = Math.random): string {
	return `${prefix}-${random().toString(36).substr(2, 9)}`;
}

/**
 * Create accessibility props for chart
 */
export function createChartAccessibilityProps(
	chartType: string,
	dataLabel?: string,
	data?: readonly number[],
	labels?: readonly string[],
): AccessibilityProps {
	const label = generateChartLabel(chartType, dataLabel);
	const description = data ? generateChartDescription(data, labels) : undefined;
	const id = generateAriaId("chart");

	return {
		role: "img",
		"aria-label": label,
		...(description !== undefined && { "aria-describedby": `${id}-desc` }),
	};
}

/**
 * Create accessibility props for data point
 */
export function createDataPointAccessibilityProps(
	value: number,
	label?: string,
	index?: number,
	isInteractive?: boolean,
): AccessibilityProps {
	const pointLabel = generateDataPointLabel(value, label, index);

	return {
		role: isInteractive ? "button" : "img",
		"aria-label": pointLabel,
		...(isInteractive !== undefined && { tabIndex: isInteractive ? 0 : -1 }),
	};
}

/**
 * Announce chart changes to screen readers
 */
export function announceChartChange(message: string, priority: "polite" | "assertive" = "polite"): void {
	const announcement = document.createElement("div");
	announcement.setAttribute("role", "status");
	announcement.setAttribute("aria-live", priority);
	announcement.setAttribute("aria-atomic", "true");
	announcement.style.position = "absolute";
	announcement.style.left = "-10000px";
	announcement.style.width = "1px";
	announcement.style.height = "1px";
	announcement.style.overflow = "hidden";
	announcement.textContent = message;

	document.body.appendChild(announcement);

	// Remove after announcement
	setTimeout(() => {
		document.body.removeChild(announcement);
	}, 1000);
}

/**
 * Check color contrast ratio (WCAG AA requires 4.5:1 for normal text)
 */
export function checkColorContrast(foreground: string, background: string): number {
	const fg = parseColor(foreground);
	const bg = parseColor(background);

	const luminance1 = calculateLuminance(fg.r, fg.g, fg.b);
	const luminance2 = calculateLuminance(bg.r, bg.g, bg.b);

	const lighter = Math.max(luminance1, luminance2);
	const darker = Math.min(luminance1, luminance2);

	return (lighter + 0.05) / (darker + 0.05);
}

function parseColor(color: string): { r: number; g: number; b: number } {
	const hex = color.replace("#", "");
	const r = Number.parseInt(hex.substr(0, 2), 16);
	const g = Number.parseInt(hex.substr(2, 2), 16);
	const b = Number.parseInt(hex.substr(4, 2), 16);
	return { r, g, b };
}

function calculateLuminance(r: number, g: number, b: number): number {
	const a = [r, g, b].map((v) => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	});
	return (a[0] ?? 0) * 0.2126 + (a[1] ?? 0) * 0.7152 + (a[2] ?? 0) * 0.0722;
}
