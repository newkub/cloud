/**
 * SecuritySettingsBlock — password change, two-factor toggle and active session management.
 */
import { createSignal, For, Show, type JSX } from "solid-js";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { PasswordStrength } from "../components/PasswordStrength";
import { SessionCard, type SessionCardSession } from "../components/SessionCard";
import { SettingsSection } from "../components/SettingsSection";
import { Switch } from "../components/Switch";

export interface SecuritySettingsBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Active sessions — marks the current one with `current: true`. */
	sessions?: SessionCardSession[];
	/** Controlled two-factor state. @default false */
	twoFactorEnabled?: boolean;
	/** Minimum new-password length. @default 8 */
	passwordMinLength?: number;
	/** Called when the two-factor toggle changes. */
	onToggleTwoFactor?: (enabled: boolean) => void;
	/** Called when the password form is submitted and valid. */
	onChangePassword?: (values: { currentPassword: string; newPassword: string }) => void | Promise<void>;
	/** Called when a session is revoked. */
	onRevokeSession?: (session: SessionCardSession) => void;
	/** Called when every other session should be signed out. */
	onRevokeAllSessions?: () => void;
}

export function SecuritySettingsBlock(props: SecuritySettingsBlockProps) {
	const [current, setCurrent] = createSignal("");
	const [next, setNext] = createSignal("");
	const [confirm, setConfirm] = createSignal("");
	const [score, setScore] = createSignal(0);
	const [busy, setBusy] = createSignal(false);

	const minLength = () => props.passwordMinLength ?? 8;
	const mismatch = () => confirm().length > 0 && confirm() !== next();
	const canSave = () =>
		current().length > 0 &&
		next().length >= minLength() &&
		next() === confirm() &&
		score() >= 2 &&
		!busy();

	const submit = async () => {
		if (!canSave()) {
			return;
		}
		setBusy(true);
		try {
			await props.onChangePassword?.({ currentPassword: current(), newPassword: next() });
			setCurrent("");
			setNext("");
			setConfirm("");
			setScore(0);
		} finally {
			setBusy(false);
		}
	};

	return (
		<div class={`flex flex-col gap-6 ${props.class ?? ""}`}>
			<Card variant="outline">
				<CardContent class="flex flex-col gap-4">
					<div>
						<h3 class="text-sm font-semibold text-foreground">Password</h3>
						<p class="mt-1 text-xs text-muted-foreground">
							Use at least {minLength()} characters and avoid reusing an old password.
						</p>
					</div>

					<div class="grid gap-3 sm:grid-cols-2">
						<div class="flex flex-col gap-1.5 sm:col-span-2">
							<Label htmlFor="security-current-password">Current password</Label>
							<Input
								id="security-current-password"
								type="password"
								autocomplete="current-password"
								value={current()}
								onChange={setCurrent}
							/>
						</div>
						<div class="flex flex-col gap-1.5">
							<Label htmlFor="security-new-password">New password</Label>
							<Input
								id="security-new-password"
								type="password"
								autocomplete="new-password"
								value={next()}
								onChange={setNext}
							/>
						</div>
						<div class="flex flex-col gap-1.5">
							<Label htmlFor="security-confirm-password">Confirm new password</Label>
							<Input
								id="security-confirm-password"
								type="password"
								autocomplete="new-password"
								value={confirm()}
								onChange={setConfirm}
								error={mismatch()}
							/>
						</div>
					</div>

					<Show when={next().length > 0}>
						<PasswordStrength value={next()} size="sm" onScoreChange={setScore} />
					</Show>
					<Show when={mismatch()}>
						<p class="text-xs text-destructive">Passwords do not match.</p>
					</Show>

					<div class="flex justify-end">
						<Button
							type="button"
							variant="primary"
							size="sm"
							disabled={!canSave()}
							onClick={() => void submit()}
						>
							{busy() ? "Updating…" : "Update password"}
						</Button>
					</div>
				</CardContent>
			</Card>

			<SettingsSection
				title="Two-factor authentication"
				description="Require a second step when signing in from a new device."
				rows={[
					{
						label: "Authenticator app",
						description: props.twoFactorEnabled
							? "Enabled — codes are required at sign-in."
							: "Not configured yet.",
						control: (
							<Switch
								checked={props.twoFactorEnabled}
								onChange={props.onToggleTwoFactor}
								aria-label="Enable authenticator app"
							/>
						),
					},
					{
						label: "Recovery codes",
						description: "Ten single-use codes for when you lose your device.",
						control: (
							<Button type="button" variant="secondary" size="sm" disabled={!props.twoFactorEnabled}>
								View codes
							</Button>
						),
					},
				]}
			/>

			<Card variant="outline">
				<CardContent class="flex flex-col gap-3">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<h3 class="text-sm font-semibold text-foreground">Active sessions</h3>
							<p class="mt-1 text-xs text-muted-foreground">
								Revoke anything you do not recognise.
							</p>
						</div>
						<Show when={(props.sessions?.length ?? 0) > 1}>
							<Button type="button" variant="ghost" size="sm" onClick={props.onRevokeAllSessions}>
								Sign out others
							</Button>
						</Show>
					</div>

					<div class="flex flex-col">
						<For each={props.sessions ?? []}>
							{(session) => <SessionCard session={session} onRevoke={props.onRevokeSession} />}
						</For>
						<Show when={(props.sessions?.length ?? 0) === 0}>
							<p class="py-3 text-xs text-muted-foreground">No other active sessions.</p>
						</Show>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
