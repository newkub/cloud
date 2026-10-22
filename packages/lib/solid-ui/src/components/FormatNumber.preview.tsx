/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { FormatNumber } from "./FormatNumber";

export const preview = (): JSX.Element => <FormatNumber value={1234567.89} notation="compact" />;
