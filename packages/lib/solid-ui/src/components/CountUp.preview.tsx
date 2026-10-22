/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { CountUp } from "./CountUp";

export const preview = (): JSX.Element => <CountUp to={1248} separator />;
