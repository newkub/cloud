/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { InfoRow } from "./InfoRow";

export const preview = (): JSX.Element => <InfoRow label="Status" value="Active" class="w-56" />;
