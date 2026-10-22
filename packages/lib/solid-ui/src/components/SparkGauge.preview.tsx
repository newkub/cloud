/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { SparkGauge } from "./SparkGauge";

export const preview = (): JSX.Element => <SparkGauge value={72} label="CPU" />;
