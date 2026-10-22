/**
 * Co-located preview — picked up automatically by renderPreview
 * (site cards, docs canvas, sweeps and stories all render this).
 */
import type { JSX } from "solid-js";
import { FieldError } from "./FieldError";

export const preview = (): JSX.Element => (
	<div class="flex w-56 flex-col gap-1">
		<div class="h-9 rounded-md border border-destructive bg-surface px-3 py-2 text-sm text-muted-foreground">
			not-an-email
		</div>
		<FieldError message="Enter a valid email address" />
	</div>
);
