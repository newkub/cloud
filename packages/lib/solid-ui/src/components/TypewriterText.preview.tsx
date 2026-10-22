/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { TypewriterText } from "./TypewriterText";

export const preview = (): JSX.Element => <TypewriterText text="Hello, world." static />;
