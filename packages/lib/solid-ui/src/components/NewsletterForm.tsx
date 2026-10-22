/**
 * NewsletterForm — email capture block with submit feedback.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { Button } from "./Button";
import { Input } from "./Input";

export interface NewsletterFormProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
	/** Heading @default "Stay in the loop" */
	title?: string;
	/** Supporting copy @default "Get product updates, no spam." */
	description?: string;
	/** Called with the entered email */
	onSubmit?: (email: string) => void | Promise<void>;
	/** Placeholder @default "you@example.com" */
	placeholder?: string;
	/** Button label @default "Subscribe" */
	buttonLabel?: string;
	/** Success message @default "Thanks for subscribing!" */
	successMessage?: string;
	/** Privacy note under the input */
	note?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function NewsletterForm(props: NewsletterFormProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"description",
		"onSubmit",
		"placeholder",
		"buttonLabel",
		"successMessage",
		"note",
		"radius",
		"elevation",
	]);
	const [email, setEmail] = createSignal("");
	const [state, setState] = createSignal<"idle" | "loading" | "done">("idle");

	const submit = async (e: Event) => {
		e.preventDefault();
		if (!email()) return;
		setState("loading");
		try {
			await local.onSubmit?.(email());
			setState("done");
		} catch {
			setState("idle");
		}
	};

	return (
		<div
			class={`solidui-newsletter-form border border-border bg-card p-6 ${radiusMap[local.radius ?? "xl"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<h3 class="text-base font-semibold text-foreground">{local.title ?? "Stay in the loop"}</h3>
			<p class="mt-1 text-sm text-muted-foreground">{local.description ?? "Get product updates, no spam."}</p>
			<Show
				when={state() !== "done"}
				fallback={
					<p
						class="mt-4 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success"
						role="status"
					>
						{local.successMessage ?? "Thanks for subscribing!"}
					</p>
				}
			>
				<form class="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={submit}>
					<Input
						type="email"
						required
						placeholder={local.placeholder ?? "you@example.com"}
						value={email()}
						onInput={(e) => setEmail(e.currentTarget.value)}
						class="flex-1"
						aria-label="Email address"
					/>
					<Button type="submit" variant="primary" disabled={state() === "loading"}>
						{state() === "loading" ? "…" : (local.buttonLabel ?? "Subscribe")}
					</Button>
				</form>
			</Show>
			<Show when={local.note}>
				<p class="mt-3 text-2xs text-muted-foreground">{local.note}</p>
			</Show>
		</div>
	);
}
