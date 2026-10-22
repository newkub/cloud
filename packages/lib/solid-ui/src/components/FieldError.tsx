/**
 * FieldError — form-field error text with an icon and role="alert".
 */
import { type JSX, Show, splitProps } from "solid-js";

export interface FieldErrorProps extends JSX.HTMLAttributes<HTMLParagraphElement> {
	/** Error text — renders nothing while empty. */
	message?: string;
	/** Live-region politeness announced with the alert. @default "assertive" */
	live?: "polite" | "assertive";
}

export function FieldError(props: FieldErrorProps) {
	const [local, rest] = splitProps(props, ["class", "message", "live"]);
	return (
		<Show when={local.message}>
			<p
				role="alert"
				aria-live={local.live ?? "assertive"}
				class={`solidui-field-error flex items-center gap-1.5 text-xs text-destructive ${local.class ?? ""}`.trim()}
				{...rest}
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-3.5 w-3.5 shrink-0"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="9" />
					<path d="M12 8v4" />
					<path d="M12 16h.01" />
				</svg>
				<span>{local.message}</span>
			</p>
		</Show>
	);
}
