import { createSignal, Show, type JSX } from "solid-js";
import { Button } from "../components/Button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/Card";
import { Checkbox } from "../components/Checkbox";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { PasswordStrength } from "../components/PasswordStrength";

export interface SignupBlockProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
	title?: string;
	description?: string;
	submitLabel?: string;
	/** Shown after a successful submit. */
	successTitle?: string;
	successDescription?: string;
	onSubmit?: (values: { name: string; email: string; password: string }) => void | Promise<void>;
	footer?: JSX.Element;
}

/** Account creation flow with validation, password strength and a completion state. */
export function SignupBlock(props: SignupBlockProps) {
	const [name, setName] = createSignal("");
	const [email, setEmail] = createSignal("");
	const [password, setPassword] = createSignal("");
	const [terms, setTerms] = createSignal(false);
	const [submitted, setSubmitted] = createSignal(false);
	const [busy, setBusy] = createSignal(false);

	const emailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email());
	const canSubmit = () => name().trim().length > 1 && emailValid() && password().length >= 8 && terms();

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (!canSubmit() || busy()) return;
		setBusy(true);
		try {
			await props.onSubmit?.({ name: name(), email: email(), password: password() });
			setSubmitted(true);
		} finally {
			setBusy(false);
		}
	}

	return (
		<div class={props.class}>
			<Card class="mx-auto w-full max-w-md">
				<Show
					when={!submitted()}
					fallback={
						<CardContent class="flex flex-col items-center gap-2 py-10 text-center">
							<span class="text-3xl" aria-hidden="true">
								✓
							</span>
							<h2 class="text-lg font-semibold">{props.successTitle ?? "Check your inbox"}</h2>
							<p class="text-sm text-muted-foreground">
								{props.successDescription ?? `We sent a verification link to ${email()}.`}
							</p>
						</CardContent>
					}
				>
					<form onSubmit={submit} novalidate>
						<CardHeader>
							<h2 class="text-lg font-semibold">{props.title ?? "Create your account"}</h2>
							<Show when={props.description}>
								<p class="text-sm text-muted-foreground">{props.description}</p>
							</Show>
						</CardHeader>
						<CardContent class="flex flex-col gap-4">
							<div class="flex flex-col gap-1.5">
								<Label htmlFor="signup-name" required>
									Full name
								</Label>
								<Input
									id="signup-name"
									value={name()}
									autocomplete="name"
									placeholder="Ada Lovelace"
									onChange={setName}
								/>
							</div>
							<div class="flex flex-col gap-1.5">
								<Label htmlFor="signup-email" required>
									Email
								</Label>
								<Input
									id="signup-email"
									type="email"
									value={email()}
									autocomplete="email"
									placeholder="you@company.com"
									error={email().length > 0 && !emailValid()}
									onChange={setEmail}
								/>
							</div>
							<div class="flex flex-col gap-1.5">
								<Label htmlFor="signup-password" required>
									Password
								</Label>
								<Input
									id="signup-password"
									type="password"
									value={password()}
									autocomplete="new-password"
									placeholder="At least 8 characters"
									onChange={setPassword}
								/>
								<Show when={password().length > 0}>
									<PasswordStrength value={password()} />
								</Show>
							</div>
							<Checkbox
								checked={terms()}
								onChange={setTerms}
								label="I agree to the terms of service and privacy policy"
							/>
						</CardContent>
						<CardFooter class="flex-col gap-3">
							<Button type="submit" variant="primary" class="w-full" disabled={!canSubmit() || busy()}>
								{busy() ? "Creating account…" : (props.submitLabel ?? "Create account")}
							</Button>
							{props.footer}
						</CardFooter>
					</form>
				</Show>
			</Card>
		</div>
	);
}
