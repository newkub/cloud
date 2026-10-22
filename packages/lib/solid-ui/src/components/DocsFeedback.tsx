/**
 * DocsFeedback — "Was this helpful?" yes/no widget with an optional comment and thank-you state.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type SurfaceVariant, surfaceVariants } from "../lib/variants";

export interface DocsFeedbackLabels {
	/** Prompt text. @default "Was this page helpful?" */
	question?: string;
	/** Positive button. @default "Yes" */
	yes?: string;
	/** Negative button. @default "No" */
	no?: string;
	/** Textarea placeholder. @default "Tell us more (optional)" */
	placeholder?: string;
	/** Submit button. @default "Send feedback" */
	submit?: string;
	/** Confirmation text. @default "Thanks for your feedback!" */
	thanks?: string;
}

export interface DocsFeedbackProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
	/**
	 * Called when the user picks yes/no — and again on submit when a comment is provided
	 * (second argument carries the comment).
	 */
	onVote?: (vote: "yes" | "no", comment?: string) => void;
	/** Override all visible copy. */
	labels?: DocsFeedbackLabels;
	/** Panel tone. @default "default" */
	variant?: SurfaceVariant;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function DocsFeedback(props: DocsFeedbackProps) {
	const [local, pass] = splitProps(props, ["onVote", "labels", "children"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "rounded-lg border p-4",
		variants: surfaceVariants,
		defaultVariant: "default",
		unstyled: props.unstyled,
	});
	const [vote, setVote] = createSignal<"yes" | "no" | null>(null);
	const [submitted, setSubmitted] = createSignal(false);
	const [comment, setComment] = createSignal("");

	const labels = () => ({
		question: local.labels?.question ?? "Was this page helpful?",
		yes: local.labels?.yes ?? "Yes",
		no: local.labels?.no ?? "No",
		placeholder: local.labels?.placeholder ?? "Tell us more (optional)",
		submit: local.labels?.submit ?? "Send feedback",
		thanks: local.labels?.thanks ?? "Thanks for your feedback!",
	});

	const pick = (v: "yes" | "no") => {
		setVote(v);
		local.onVote?.(v);
	};

	const submit = () => {
		const text = comment().trim();
		const v = vote();
		if (v && text) local.onVote?.(v, text);
		setSubmitted(true);
	};

	const btn = (v: "yes" | "no", label: string) => (
		<button
			type="button"
			aria-pressed={vote() === v}
			class={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
				vote() === v
					? "border-primary bg-primary text-primary-foreground"
					: "border-border bg-surface text-foreground hover:bg-muted"
			}`}
			onClick={() => pick(v)}
		>
			{label}
		</button>
	);

	return (
		<div class={className()} {...rest}>
			<Show when={!submitted()} fallback={<p class="text-sm text-muted-foreground">{labels().thanks}</p>}>
				<p class="text-sm font-medium text-foreground">{labels().question}</p>
				<div class="mt-2 flex items-center gap-2">
					{btn("yes", labels().yes)}
					{btn("no", labels().no)}
				</div>
				<Show when={vote() !== null}>
					<form
						class="mt-3 flex flex-col gap-2"
						onSubmit={(e) => {
							e.preventDefault();
							submit();
						}}
					>
						<textarea
							class="min-h-16 w-full rounded-md border border-input bg-background p-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							placeholder={labels().placeholder}
							value={comment()}
							onInput={(e) => setComment(e.currentTarget.value)}
						/>
						<button
							type="submit"
							class="self-start rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							{labels().submit}
						</button>
					</form>
				</Show>
			</Show>
		</div>
	);
}
