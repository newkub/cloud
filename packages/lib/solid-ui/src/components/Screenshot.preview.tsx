/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Screenshot } from "./Screenshot";

export const preview = (): JSX.Element => (
	<Screenshot url="https://app.example.com/dashboard" caption="Dashboard overview" />
);
