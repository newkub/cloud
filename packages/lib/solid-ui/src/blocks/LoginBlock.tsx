import { createSignal, type JSX } from "solid-js";
import { Button } from "../components/Button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/Card";
import { Checkbox } from "../components/Checkbox";
import { Input } from "../components/Input";
import { Label } from "../components/Label";

export interface LoginBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Called with email/password on submit. */
	onLogin?: (values: { email: string; password: string; remember: boolean }) => void;
}

/** Composed login card — email/password fields, remember-me, submit. */
export function LoginBlock(props: LoginBlockProps) {
	const [email, setEmail] = createSignal("");
	const [password, setPassword] = createSignal("");
	const [remember, setRemember] = createSignal(false);
	const submit = (e: Event) => {
		e.preventDefault();
		props.onLogin?.({ email: email(), password: password(), remember: remember() });
	};
	return (
		<div class={props.class}>
			<Card class="mx-auto w-full max-w-sm">
				<CardHeader>
					<h2 class="text-lg font-semibold">Sign in</h2>
					<p class="text-sm text-muted-foreground">Enter your credentials to continue.</p>
				</CardHeader>
				<form onSubmit={submit}>
					<CardContent class="flex flex-col gap-4">
						<div class="flex flex-col gap-1.5">
							<Label for="login-email">Email</Label>
							<Input
								id="login-email"
								type="email"
								placeholder="you@example.com"
								value={email()}
								onInput={(e) => setEmail(e.currentTarget.value)}
								required
							/>
						</div>
						<div class="flex flex-col gap-1.5">
							<Label for="login-password">Password</Label>
							<Input
								id="login-password"
								type="password"
								value={password()}
								onInput={(e) => setPassword(e.currentTarget.value)}
								required
							/>
						</div>
						<div class="flex items-center gap-2">
							<Checkbox id="login-remember" checked={remember()} onChange={setRemember} />
							<Label for="login-remember">Remember me</Label>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" variant="primary" class="w-full">
							Sign in
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
