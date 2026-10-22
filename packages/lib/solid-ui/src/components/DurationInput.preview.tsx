/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { DurationInput } from "./DurationInput";

export const preview = (): JSX.Element => <DurationInput class="w-72 max-w-full" defaultValue={90061} />;
