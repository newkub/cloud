/**
 * ValidationSummary - lists form errors at the top of a form with jump links.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface ValidationError {
	/** Target field id to focus on click. */
	fieldId?: string;
	/** Error message text. */
	message: string;
}

export interface ValidationSummaryProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Errors to display; the region hides when empty. */
	errors?: ValidationError[];
	/** Heading text. @default "Please fix the following errors" */
	title?: string;
	/** Called when an error link is clicked. */
	onSelect?: (error: ValidationError) => void;
	/** Corner radius. */
	radius?: Radius;
}

export function ValidationSummary(props: ValidationSummaryProps) {
	const [local, rest] = splitProps(props, ["class", "errors", "title", "onSelect", "radius"]);

	const focus = (err: ValidationError) => {
		if (err.fieldId) document.getElementById(err.fieldId)?.focus();
		local.onSelect?.(err);
	};

	const className = () =>
		[
			"solidui-validation-summary border border-destructive bg-destructive/10 p-4 text-destructive",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<Show when={(local.errors ?? []).length > 0}>
			<div class={className()} role="alert" {...rest}>
				<p class="text-sm font-medium">{local.title ?? "Please fix the following errors"}</p>
				<ul class="mt-2 list-disc pl-5 text-sm space-y-1">
					<For each={local.errors ?? []}>
						{(err) => (
							<li>
								<button
									type="button"
									class="underline underline-offset-2 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
									onClick={() => focus(err)}
								>
									{err.message}
								</button>
							</li>
						)}
					</For>
				</ul>
			</div>
		</Show>
	);
}
