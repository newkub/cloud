import { createSignal, Show, type JSX } from "solid-js";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/Card";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { PinInput } from "../components/PinInput";

export type SignInStage = "email" | "code" | "done";

export interface SignInBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title?: string;
	description?: string;
	/** Digits in the emailed code @default 6 */
	codeLength?: number;
	/** Account shown in the final stage. */
	account?: { name: string; email: string; src?: string };
	onSendCode?: (email: string) => void | Promise<void>;
	onVerify?: (code: string) => void | Promise<void>;
}

/** Sign-in card that moves from email to a digit code to the signed-in account. */
export function SignInBlock(props: SignInBlockProps) {
	const [stage, setStage] = createSignal<SignInStage>("email");
	const [email, setEmail] = createSignal("");
	const [code, setCode] = createSignal("");
	const [error, setError] = createSignal("");
	const [busy, setBusy] = createSignal(false);
	const length = () => props.codeLength ?? 6;

	async function sendCode(event: SubmitEvent) {
		event.preventDefault();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email()) || busy()) return;
		setBusy(true);
		setError("");
		try {
			await props.onSendCode?.(email());
			setStage("code");
		} catch {
			setError("We could not send a code. Try again.");
		} finally {
			setBusy(false);
		}
	}

	async function verify(value: string) {
		setCode(value);
		if (value.length !== length()) return;
		setBusy(true);
		setError("");
		try {
			await props.onVerify?.(value);
			setStage("done");
		} catch {
			setError("That code is not valid.");
			setCode("");
		} finally {
			setBusy(false);
		}
	}

	return (
		<div class={props.class}>
			<Card class="mx-auto w-full max-w-sm">
				<CardHeader>
					<h2 class="text-lg font-semibold">
						{stage() === "done" ? "You are signed in" : (props.title ?? "Sign in")}
					</h2>
					<p class="text-sm text-muted-foreground">
						{stage() === "email" && (props.description ?? "We will email you a one-time code.")}
						{stage() === "code" && `Enter the ${length()}-digit code sent to ${email()}.`}
						{stage() === "done" && "Your session is ready."}
					</p>
				</CardHeader>
				<CardContent class="flex flex-col gap-4">
					<Show when={stage() === "email"}>
						<form onSubmit={sendCode} class="flex flex-col gap-4">
							<div class="flex flex-col gap-1.5">
								<Label htmlFor="signin-email" required>
									Email
								</Label>
								<Input
									id="signin-email"
									type="email"
									value={email()}
									autocomplete="email"
									placeholder="you@company.com"
									error={error() !== ""}
									onChange={setEmail}
								/>
							</div>
							<Button type="submit" variant="primary" class="w-full" disabled={busy()}>
								{busy() ? "Sending…" : "Continue with email"}
							</Button>
						</form>
					</Show>
					<Show when={stage() === "code"}>
						<div class="flex flex-col items-center gap-4">
							<PinInput
								length={length()}
								value={code()}
								otp
								type="numeric"
								error={error() || undefined}
								onChange={verify}
							/>
							<Button variant="ghost" size="sm" onClick={() => setStage("email")}>
								Use a different email
							</Button>
						</div>
					</Show>
					<Show when={stage() === "done"}>
						<div class="flex items-center gap-3">
							<Avatar
								src={props.account?.src}
								alt={props.account?.name ?? "Account"}
								fallback={props.account?.name?.slice(0, 1) ?? "?"}
							/>
							<div class="min-w-0">
								<p class="truncate text-sm font-medium">{props.account?.name ?? "Wrikka user"}</p>
								<p class="truncate text-xs text-muted-foreground">{props.account?.email ?? email()}</p>
							</div>
						</div>
					</Show>
				</CardContent>
				<Show when={stage() === "done"}>
					<CardFooter>
						<Button variant="secondary" class="w-full" onClick={() => setStage("email")}>
							Switch account
						</Button>
					</CardFooter>
				</Show>
			</Card>
		</div>
	);
}
