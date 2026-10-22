/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { TestimonialCard } from "./TestimonialCard";

export const preview = (): JSX.Element => (
	<TestimonialCard quote="Fastest component lib I've used." author="Ada" rating={5} class="w-72" />
);
