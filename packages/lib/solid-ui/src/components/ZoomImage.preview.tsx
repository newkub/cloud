/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ZoomImage } from "./ZoomImage";

export const preview = (): JSX.Element => <ZoomImage alt="Topo map" zoom={2.5} />;
