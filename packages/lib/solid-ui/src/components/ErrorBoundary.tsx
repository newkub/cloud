/**
 * ErrorBoundary - renders children or a fallback when they throw.
 */
import { type JSX, ErrorBoundary as SolidErrorBoundary } from "solid-js";
import { paddingSizes, statusVariants } from "../lib/variants";

export interface ErrorBoundaryProps {
	children: JSX.Element;
	fallback?: (err: Error, reset: () => void) => JSX.Element;
	onError?: (err: Error) => void;
	class?: string;
	variant?: "default" | "primary" | "success" | "warning" | "destructive" | "info";
	size?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
	const fallback =
		props.fallback ??
		((err: Error) => (
			<div
				role="alert"
				class={`rounded-md border ${statusVariants[props.variant ?? "destructive"]} ${paddingSizes[props.size ?? "md"]} text-sm ${props.class ?? ""}`}
			>
				<p class="font-medium">Something went wrong</p>
				<p class="mt-1">{err.message}</p>
			</div>
		));

	return (
		<SolidErrorBoundary
			fallback={(err, reset) => {
				props.onError?.(err);
				return fallback(err, reset);
			}}
		>
			{props.children}
		</SolidErrorBoundary>
	);
}
