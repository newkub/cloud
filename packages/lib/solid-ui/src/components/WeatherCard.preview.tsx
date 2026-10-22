/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { WeatherCard } from "./WeatherCard";

export const preview = (): JSX.Element => (
	<div class="flex flex-wrap gap-3">
		<WeatherCard condition="sun" temp={32} hi={35} lo={26} humidity={58} wind={12} location="Bangkok" />
		<WeatherCard condition="rain" temp={18} hi={21} lo={15} humidity={84} wind={22} location="London" />
	</div>
);
