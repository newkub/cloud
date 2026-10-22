/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Blockquote } from "./Blockquote";

export const preview = (): JSX.Element => <Blockquote citation="— Ada">Make it work, then make it right.</Blockquote>;
