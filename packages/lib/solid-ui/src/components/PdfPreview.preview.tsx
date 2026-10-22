/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { PdfPreview } from "./PdfPreview";

export const preview = (): JSX.Element => <PdfPreview pages={8} zoom={75} />;
