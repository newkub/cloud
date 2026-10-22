/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ScrambleText } from "./ScrambleText";

export const preview = (): JSX.Element => <ScrambleText text="Scramble text" static class="text-sm" />;
