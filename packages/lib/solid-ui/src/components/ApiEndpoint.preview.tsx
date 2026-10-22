/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { ApiEndpoint } from "./ApiEndpoint";

export const preview = (): JSX.Element => (
	<ApiEndpoint method="GET" path="/v1/users" description="List users" class="w-80 max-w-full" />
);
