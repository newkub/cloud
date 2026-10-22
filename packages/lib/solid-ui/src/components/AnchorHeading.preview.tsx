/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { AnchorHeading } from "./AnchorHeading";

export const preview = (): JSX.Element => <AnchorHeading level={2}>Heading</AnchorHeading>;
