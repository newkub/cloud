/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CountdownRing } from "./CountdownRing";

export const preview = (): JSX.Element => <CountdownRing seconds={90} />;
