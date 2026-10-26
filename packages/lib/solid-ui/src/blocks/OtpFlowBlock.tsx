import { createSignal, onCleanup, onMount, Show, type JSX } from "solid-js";
import { Button } from "../components/Button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/Card";
import { Divider } from "../components/Divider";
import { PinInput } from "../components/PinInput";
import { ProgressSteps } from "../components/ProgressSteps";

export interface OtpFlowBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title?: string;
	description?: string;
	/** Seconds before the resend action re-enables @default 30 */
	resendAfter?: number;
	/** Digits in the code @default 6 */
	length?: number;
	onVerify?: (code: string) => void | Promise<void>;
	onResend?: () => void | Promise<void>;
}

/** Six-digit verification flow with a resend cooldown and a completion state. */
export function OtpFlowBlock(props: OtpFlowBlockProps) {
	const [code, setCode] = createSignal("");
	const [seconds, setSeconds] = createSignal(props.resendAfter ?? 30);
	const [error, setError] = createSignal("");
	const [verified, setVerified] = createSignal(false);
	const [busy, setBusy] = createSignal(false);
	const length = () => props.length ?? 6;

	onMount(() => {
		const timer = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
		onCleanup(() => clearInterval(timer));
	});

	async function verify(value: string) {
		setCode(value);
		if (value.length !== length()) return;
		setBusy(true);
		setError("");
		try {
			await props.onVerify?.(value);
			setVerified(true);
		} catch {
			setError("The code is incorrect or expired.");
			setCode("");
		} finally {
			setBusy(false);
		}
	}

	async function resend() {
		await props.onResend?.();
		setSeconds(props.resendAfter ?? 30);
		setError("");
	}

	return (
		<div class={props.class}>
			<Card class="mx-auto w-full max-w-sm">
				<CardHeader>
					<h2 class="text-lg font-semibold">{props.title ?? "Verify your email"}</h2>
					<p class="text-sm text-muted-foreground">
						{props.description ?? `Enter the ${length()}-digit code we sent you.`}
					</p>
				</CardHeader>
				<CardContent class="flex flex-col gap-5">
					<ProgressSteps
						steps={[
							{ label: "Account", status: "done" },
							{ label: "Verify", status: verified() ? "done" : "active" },
							{ label: "Ready", status: verified() ? "active" : "pending" },
						]}
						size="sm"
					/>
					<Show
						when={!verified()}
						fallback={
							<p class="rounded-md bg-success/10 px-3 py-6 text-center text-sm text-success">
								Email verified. You can continue.
							</p>
						}
					>
						<PinInput
							length={length()}
							value={code()}
							otp
							type="numeric"
							disabled={busy()}
							error={error() || undefined}
							onChange={verify}
						/>
					</Show>
				</CardContent>
				<Show when={!verified()}>
					<CardFooter class="flex-col gap-2">
						<Divider />
						<p class="text-center text-xs text-muted-foreground">
							<Show when={seconds() > 0} fallback="You can request a new code now.">
								Resend available in {seconds()}s
							</Show>
						</p>
						<Button variant="ghost" size="sm" disabled={seconds() > 0} onClick={resend}>
							Resend code
						</Button>
					</CardFooter>
				</Show>
			</Card>
		</div>
	);
}
