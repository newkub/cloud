/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Anchor } from "./Anchor";

export const preview = (): JSX.Element => <Anchor href="#section">Jump to section</Anchor>;
