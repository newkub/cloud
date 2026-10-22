import { Link } from "@tanstack/solid-router";

export function NotFound() {
	return (
		<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
			<span class="i-mdi:cloud-off-outline text-5xl text-faint" />
			<div>
				<h1 class="text-lg font-semibold">Page not found</h1>
				<p class="mt-1 text-sm text-dim">
					This route doesn’t exist in the console yet.
				</p>
			</div>
			<Link
				to="/"
				class="rounded-lg border border-edge bg-panel px-3 py-1.5 text-sm text-fg hover:border-acc/40 hover:text-acc"
			>
				Back to products
			</Link>
		</div>
	);
}
