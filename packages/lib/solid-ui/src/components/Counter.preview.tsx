/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Counter } from "./Counter";

export const preview = (): JSX.Element => <Counter value={128} />;
