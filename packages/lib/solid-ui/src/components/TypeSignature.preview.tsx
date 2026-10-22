/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { TypeSignature } from "./TypeSignature";

export const preview = (): JSX.Element => (
	<TypeSignature signature="function merge(a: A, b: B): A & B" name="merge" returns="A & B" class="w-80 max-w-full" />
);
