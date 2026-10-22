/**
 * WebVitalsDashboard - SolidJS component for web vitals visualization
 */

import { createMemo, createSignal, For, Show, splitProps } from "solid-js";
import type { WebVital } from "#analytics/modules/analytics/types";

interface WebVitalsDashboardProps {
	webVitals?: readonly WebVital[];
	onFilterChange?: (filter: WebVitalFilter) => void;
}

interface WebVitalFilter {
	vitalType?: "CLS" | "FID" | "FCP" | "LCP" | "TTFB";
	rating?: "good" | "needs-improvement" | "poor";
	path?: string;
}

export function WebVitalsDashboard(props: WebVitalsDashboardProps) {
	const [local] = splitProps(props, ["webVitals", "onFilterChange"]);

	const [selectedVitalType, setSelectedVitalType] = createSignal<
		"CLS" | "FID" | "FCP" | "LCP" | "TTFB" | "all"
	>("all");
	const [selectedRating, setSelectedRating] = createSignal<
		"good" | "needs-improvement" | "poor" | "all"
	>("all");

	const filteredVitals = createMemo(() => {
		if (!local.webVitals) return [];

		return local.webVitals.filter((vital) => {
			if (selectedVitalType() !== "all" && vital.name !== selectedVitalType()) {
				return false;
			}
			if (selectedRating() !== "all" && vital.rating !== selectedRating()) {
				return false;
			}
			return true;
		});
	});

	const vitalStats = createMemo(() => {
		if (!local.webVitals) return null;

		const byType = {
			CLS: { good: 0, needsImprovement: 0, poor: 0, total: 0 },
			FID: { good: 0, needsImprovement: 0, poor: 0, total: 0 },
			FCP: { good: 0, needsImprovement: 0, poor: 0, total: 0 },
			LCP: { good: 0, needsImprovement: 0, poor: 0, total: 0 },
			TTFB: { good: 0, needsImprovement: 0, poor: 0, total: 0 },
		};

		local.webVitals.forEach((vital) => {
			const stats = byType[vital.name as keyof typeof byType];
			if (stats) {
				stats.total++;
				if (vital.rating === "good") stats.good++;
				if (vital.rating === "needs-improvement") stats.needsImprovement++;
				if (vital.rating === "poor") stats.poor++;
			}
		});

		return byType;
	});

	const getRatingColor = (rating: string) => {
		switch (rating) {
			case "good":
				return "text-green-600 bg-green-50";
			case "needs-improvement":
				return "text-yellow-600 bg-yellow-50";
			case "poor":
				return "text-red-600 bg-red-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	const getRatingBadge = (rating: string) => {
		switch (rating) {
			case "good":
				return "✓ Good";
			case "needs-improvement":
				return "⚠ Needs Improvement";
			case "poor":
				return "✗ Poor";
			default:
				return rating;
		}
	};

	return (
		<div class="web-vitals-dashboard">
			<div class="vitals-header">
				<h2 class="vitals-title">Web Vitals Dashboard</h2>
				<div class="vitals-filters">
					<select
						value={selectedVitalType()}
						onChange={(e) =>
							setSelectedVitalType(
								e.currentTarget.value as
									| "all"
									| "CLS"
									| "FID"
									| "FCP"
									| "LCP"
									| "TTFB",
							)
						}
						class="filter-select"
					>
						<option value="all">All Types</option>
						<option value="CLS">CLS (Cumulative Layout Shift)</option>
						<option value="FID">FID (First Input Delay)</option>
						<option value="FCP">FCP (First Contentful Paint)</option>
						<option value="LCP">LCP (Largest Contentful Paint)</option>
						<option value="TTFB">TTFB (Time to First Byte)</option>
					</select>
					<select
						value={selectedRating()}
						onChange={(e) =>
							setSelectedRating(
								e.currentTarget.value as
									| "all"
									| "good"
									| "needs-improvement"
									| "poor",
							)
						}
						class="filter-select"
					>
						<option value="all">All Ratings</option>
						<option value="good">Good</option>
						<option value="needs-improvement">Needs Improvement</option>
						<option value="poor">Poor</option>
					</select>
				</div>
			</div>

			<Show when={vitalStats()}>
				<div class="vitals-summary">
					<For each={Object.entries(vitalStats() || {})}>
						{([type, stats]) => (
							<div class="vital-summary-card">
								<div class="vital-type">{type}</div>
								<div class="vital-stats">
									<div class="stat-item good">
										<span class="stat-label">Good:</span>
										<span class="stat-value">{stats.good}</span>
									</div>
									<div class="stat-item needs-improvement">
										<span class="stat-label">Needs Improvement:</span>
										<span class="stat-value">{stats.needsImprovement}</span>
									</div>
									<div class="stat-item poor">
										<span class="stat-label">Poor:</span>
										<span class="stat-value">{stats.poor}</span>
									</div>
								</div>
								<div class="vital-total">Total: {stats.total}</div>
							</div>
						)}
					</For>
				</div>
			</Show>

			<div class="vitals-list">
				<Show when={filteredVitals().length > 0}>
					<For each={filteredVitals()}>
						{(vital) => (
							<div class={`vital-card ${getRatingColor(vital.rating)}`}>
								<div class="vital-header">
									<div class="vital-name">{vital.name}</div>
									<div
										class={`vital-rating-badge ${getRatingColor(vital.rating)}`}
									>
										{getRatingBadge(vital.rating)}
									</div>
								</div>
								<div class="vital-value">{vital.value.toFixed(2)}</div>
								<div class="vital-path">{vital.path}</div>
								<div class="vital-timestamp">
									{new Date(vital.timestamp).toLocaleString()}
								</div>
							</div>
						)}
					</For>
				</Show>
				<Show when={filteredVitals().length === 0}>
					<div class="empty-state">No web vitals match the current filters</div>
				</Show>
			</div>
		</div>
	);
}
