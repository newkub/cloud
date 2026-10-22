/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { VersionBadge } from "./VersionBadge";

export const preview = (): JSX.Element => <VersionBadge version="2.4.1" />;
