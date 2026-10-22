/**
 * LoadingState - Loading skeleton component for command palette
 */

export function LoadingState() {
	return (
		<div class="command-loading" role="status" aria-live="polite">
			<div class="skeleton skeleton-item" />
			<div class="skeleton skeleton-item" />
			<div class="skeleton skeleton-item" />
			<div class="skeleton skeleton-item" />
			<div class="skeleton skeleton-item" />
		</div>
	);
}
