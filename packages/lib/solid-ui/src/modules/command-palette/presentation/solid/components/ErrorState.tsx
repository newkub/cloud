/**
 * ErrorState - Error state component for command palette
 */

interface ErrorStateProps {
	error: string;
}

export function ErrorState(props: ErrorStateProps) {
	return (
		<div class="command-error" role="alert" aria-live="assertive">
			<div class="error-icon">⚠️</div>
			<div class="error-message">{props.error}</div>
			<button class="error-retry-button" onClick={() => window.location.reload()} type="button">
				Retry
			</button>
		</div>
	);
}
