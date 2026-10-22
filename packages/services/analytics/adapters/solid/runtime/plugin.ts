/**
 * SolidJS Analytics Plugin
 * Auto-tracking for page views, web vitals, and errors
 */

import { onMount } from "solid-js";
import type { AnalyticsContextValue } from "#analytics/presentation/solid/provider";

interface PerformanceEntryExtended {
	readonly entryType: string;
	readonly hadRecentInput?: boolean;
	readonly processingStart?: number;
	readonly startTime: number;
	readonly value?: number;
}

export const createAnalyticsPlugin = (analytics: AnalyticsContextValue) => {
	onMount(() => {
		// Auto-track page views if enabled
		if (analytics.autoTrack !== false) {
			// Track initial page view
			analytics.page(window.location.pathname);
		}

		// Track web vitals if enabled
		if (analytics.webVitals !== false && "PerformanceObserver" in window) {
			const observer = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					const extendedEntry = entry as PerformanceEntryExtended;
					if (entry.entryType === "largest-contentful-paint") {
						analytics.track("web_vitals", {
							metric: "LCP",
							value: extendedEntry.startTime || 0,
						});
					} else if (entry.entryType === "first-input") {
						analytics.track("web_vitals", {
							metric: "FID",
							value:
								(extendedEntry.processingStart || 0) -
								(extendedEntry.startTime || 0),
						});
					} else if (
						entry.entryType === "layout-shift" &&
						!extendedEntry.hadRecentInput
					) {
						analytics.track("web_vitals", {
							metric: "CLS",
							value: extendedEntry.value || 0,
						});
					}
				}
			});

			observer.observe({
				entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
			});
		}

		// Track errors if enabled
		if (analytics.errorTracking !== false) {
			window.addEventListener("error", (event: ErrorEvent) => {
				analytics.track("error", {
					message: event.message,
					filename: event.filename,
					lineno: event.lineno,
					colno: event.colno,
				});
			});

			window.addEventListener(
				"unhandledrejection",
				(event: PromiseRejectionEvent) => {
					analytics.track("error", {
						message: event.reason?.message || "Unhandled Promise Rejection",
						type: "unhandledrejection",
					});
				},
			);
		}
	});

	return analytics;
};
