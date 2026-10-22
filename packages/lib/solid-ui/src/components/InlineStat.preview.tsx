/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { InlineStat } from "./InlineStat";

export const preview = (): JSX.Element => <InlineStat label="Uptime" value="99.9%" delta={4} />;
