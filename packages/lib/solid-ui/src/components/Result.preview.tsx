/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { Result } from "./Result";

export const preview = (): JSX.Element => (
	<Result status="success" title="Deployed" description="Build finished in 42s" />
);
