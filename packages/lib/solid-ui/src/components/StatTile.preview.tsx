/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { StatTile } from "./StatTile";

export const preview = (): JSX.Element => <StatTile label="Users" value="1,248" trend="up" class="w-36" />;
