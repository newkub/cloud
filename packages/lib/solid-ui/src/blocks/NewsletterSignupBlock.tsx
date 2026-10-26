import { createSignal, Show, type JSX } from "solid-js";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { Input } from "../components/Input";

export interface NewsletterSignupBlockProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
	eyebrow?: string;
	title?: string;
	description?: string;
	/** Subscriber count or social proof shown under the form. */
	proof?: string;
	note?: string;
	buttonLabel?: string;
	successMessage?: string;
	onSubmit?: (email: string) => void | Promise<void>;
}

/** A centred newsletter call to action with social proof. */
export function NewsletterSignupBlock(props: NewsletterSignupBlockProps) {
	const [email, setEmail] = createSignal("");
	const [state, setState] = createSignal<"idle" | "busy" | "done">("idle");

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (!email() || state() === "busy") return;
		setState("busy");
		try {
			await props.onSubmit?.(email());
			setState("done");
		} catch {
			setState("idle");
		}
	}

	return (
		<div class={props.class}>
			<Card class="mx-auto w-full max-w-2xl">
				<CardContent class="flex flex-col items-center gap-5 px-6 py-10 text-center sm:px-10">
					{props.eyebrow && <Badge variant="primary">{props.eyebrow}</Badge>}
					<h2 class="max-w-lg text-2xl font-semibold tracking-tight">
						{props.title ?? "Product updates, once a month"}
					</h2>
					<p class="max-w-md text-sm text-muted-foreground">
						{props.description ?? "Shipping notes, changelog highlights and the occasional deep dive. No spam."}
					</p>
					<Show
						when={state() !== "done"}
						fallback={
							<p class="rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-success" role="status">
								{props.successMessage ?? "Thanks for subscribing!"}
							</p>
						}
					>
						<form class="flex w-full max-w-md flex-col gap-2 sm:flex-row" onSubmit={submit}>
							<Input
								type="email"
								required
								value={email()}
								placeholder="you@company.com"
								aria-label="Email address"
								onChange={setEmail}
							/>
							<Button type="submit" variant="primary" disabled={state() === "busy"}>
								{state() === "busy" ? "Subscribing…" : (props.buttonLabel ?? "Subscribe")}
							</Button>
						</form>
					</Show>
					{props.note && <p class="text-xs text-muted-foreground">{props.note}</p>}
					{props.proof && <p class="text-xs text-muted-foreground">{props.proof}</p>}
				</CardContent>
			</Card>
		</div>
	);
}
