/**
 * LoginCard — sign-in form card with email/password, remember-me, and footer links.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { Button } from "./Button";
import { Card, CardContent, CardFooter, CardHeader } from "./Card";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { Label } from "./Label";

export interface LoginCardProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
	/** Card heading @default "Sign in" */
	title?: string;
	/** Subheading @default "Enter your credentials to continue" */
	subtitle?: string;
	/** Submit handler */
	onSubmit?: (values: { email: string; password: string; remember: boolean }) => void;
	/** Loading state on the submit button @default false */
	loading?: boolean;
	/** Error message shown above the form */
	error?: string;
	/** "Forgot password" link href — hidden when unset */
	forgotHref?: string;
	/** "Create account" link href — hidden when unset */
	signupHref?: string;
	/** Submit button label @default "Sign in" */
	submitLabel?: string;
	/** Show remember-me checkbox @default true */
	showRemember?: boolean;
	/** Slot above the form (e.g. OAuth buttons) */
	headerSlot?: JSX.Element;
	/** Card visual variant @default "default" */
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	/** Card content density */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function LoginCard(props: LoginCardProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"subtitle",
		"onSubmit",
		"loading",
		"error",
		"forgotHref",
		"signupHref",
		"submitLabel",
		"showRemember",
		"headerSlot",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	const [email, setEmail] = createSignal("");
	const [password, setPassword] = createSignal("");
	const [remember, setRemember] = createSignal(false);

	const submit = (e: Event) => {
		e.preventDefault();
		local.onSubmit?.({ email: email(), password: password(), remember: remember() });
	};

	return (
		<Card
			variant={local.variant}
			class={`solidui-login-card w-full max-w-sm ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<CardHeader size={local.size}>
				<h2 class="text-lg font-semibold text-foreground">{local.title ?? "Sign in"}</h2>
				<p class="text-sm text-muted-foreground">{local.subtitle ?? "Enter your credentials to continue"}</p>
			</CardHeader>
			<CardContent size={local.size}>
				{local.headerSlot}
				<Show when={local.error}>
					<p
						class="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
						role="alert"
					>
						{local.error}
					</p>
				</Show>
				<form class="flex flex-col gap-3" onSubmit={submit}>
					<div class="flex flex-col gap-1.5">
						<Label for="login-email">Email</Label>
						<Input
							id="login-email"
							type="email"
							required
							autocomplete="email"
							placeholder="you@example.com"
							value={email()}
							onInput={(e) => setEmail(e.currentTarget.value)}
						/>
					</div>
					<div class="flex flex-col gap-1.5">
						<div class="flex items-center justify-between">
							<Label for="login-password">Password</Label>
							<Show when={local.forgotHref}>
								<a href={local.forgotHref} class="text-xs text-primary hover:underline">
									Forgot password?
								</a>
							</Show>
						</div>
						<Input
							id="login-password"
							type="password"
							required
							autocomplete="current-password"
							placeholder="••••••••"
							value={password()}
							onInput={(e) => setPassword(e.currentTarget.value)}
						/>
					</div>
					<Show when={local.showRemember !== false}>
						<Checkbox checked={remember()} onChange={setRemember} label="Remember me" />
					</Show>
					<Button type="submit" variant="primary" disabled={local.loading} class="mt-1 w-full">
						{local.loading ? "Signing in…" : (local.submitLabel ?? "Sign in")}
					</Button>
				</form>
			</CardContent>
			<Show when={local.signupHref}>
				<CardFooter class="justify-center" size={local.size}>
					<p class="text-xs text-muted-foreground">
						No account?{" "}
						<a href={local.signupHref} class="font-medium text-primary hover:underline">
							Create one
						</a>
					</p>
				</CardFooter>
			</Show>
		</Card>
	);
}
