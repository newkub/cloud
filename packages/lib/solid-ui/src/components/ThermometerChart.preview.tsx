/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ThermometerChart } from "./ThermometerChart";

export const preview = (): JSX.Element => <ThermometerChart value={64} max={100} label="Goal" />;
