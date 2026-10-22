import type { ThemePreset } from "./types";

/**
 * Weekday themes ΓÇö Thai weekday colors: Sunday red, Monday yellow,
 * Tuesday pink, Wednesday green, Thursday orange, Friday blue,
 * Saturday violet. Matches `weekdayColors` in store.ts.
 */
export const presets: ThemePreset[] = [
	{
		name: "sunday",
		label: "Sunday",
		state: {
			name: "Sunday",
			mode: "dark",
			color: "red",
			font: "sans",
			space: "normal",
			radius: "medium",
		},
	},
	{
		name: "monday",
		label: "Monday",
		state: {
			name: "Monday",
			mode: "dark",
			color: "yellow",
			font: "sans",
			space: "normal",
			radius: "medium",
		},
	},
	{
		name: "tuesday",
		label: "Tuesday",
		state: {
			name: "Tuesday",
			mode: "dark",
			color: "pink",
			font: "serif",
			space: "normal",
			radius: "large",
		},
	},
	{
		name: "wednesday",
		label: "Wednesday",
		state: {
			name: "Wednesday",
			mode: "dark",
			color: "green",
			font: "sans",
			space: "spacious",
			radius: "small",
		},
	},
	{
		name: "thursday",
		label: "Thursday",
		state: {
			name: "Thursday",
			mode: "dark",
			color: "orange",
			font: "sans",
			space: "normal",
			radius: "medium",
		},
	},
	{
		name: "friday",
		label: "Friday",
		state: {
			name: "Friday",
			mode: "dark",
			color: "blue",
			font: "sans",
			space: "normal",
			radius: "medium",
		},
	},
	{
		name: "saturday",
		label: "Saturday",
		state: {
			name: "Saturday",
			mode: "dark",
			color: "violet",
			font: "sans",
			space: "compact",
			radius: "large",
		},
	},
];
