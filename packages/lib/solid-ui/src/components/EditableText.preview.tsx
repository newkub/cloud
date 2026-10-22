/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { EditableText } from "./EditableText";

export const preview = (): JSX.Element => <EditableText defaultValue="Click to edit" />;
