/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { FlipNumber } from "./FlipNumber";

export const preview = (): JSX.Element => <FlipNumber value={42} />;
