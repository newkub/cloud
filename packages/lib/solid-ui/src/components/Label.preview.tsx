/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Label } from "./Label";

export const preview = (): JSX.Element => <Label required>Email address</Label>;
