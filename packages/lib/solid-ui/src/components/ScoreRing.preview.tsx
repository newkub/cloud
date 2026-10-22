/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ScoreRing } from "./ScoreRing";

export const preview = (): JSX.Element => <ScoreRing value={87} label="Score" />;
