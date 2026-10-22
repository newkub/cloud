/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { DateText } from "./DateText";

export const preview = (): JSX.Element => <DateText value="2026-09-15T10:30:00Z" dateStyle="medium" />;
