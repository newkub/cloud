/**
 * Co-located preview - picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { TypingIndicator } from "./TypingIndicator";

export const preview = (): JSX.Element => <TypingIndicator label="Assistant" />;
