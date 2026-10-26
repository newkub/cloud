import { createSignal, For, Show, type JSX } from "solid-js";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card, CardContent, CardHeader } from "../components/Card";
import { Divider } from "../components/Divider";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { MembersTable, type Member } from "../components/MembersTable";
import { Select } from "../components/Select";

export interface TeamMembersBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title?: string;
	description?: string;
	members?: Member[];
	roles?: string[];
	/** Invites that have not been accepted yet. */
	pending?: Member[];
	onInvite?: (email: string, role: string) => void | Promise<void>;
	onRoleChange?: (member: Member, role: string) => void;
	onRemove?: (member: Member) => void;
}

/** Team roster with role editing and an invite form. */
export function TeamMembersBlock(props: TeamMembersBlockProps) {
	const roles = () => props.roles ?? ["Admin", "Member", "Viewer"];
	const [email, setEmail] = createSignal("");
	const [role, setRole] = createSignal(roles()[1] ?? "Member");
	const [busy, setBusy] = createSignal(false);

	const valid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email());

	async function invite(event: SubmitEvent) {
		event.preventDefault();
		if (!valid() || busy()) return;
		setBusy(true);
		try {
			await props.onInvite?.(email(), role());
			setEmail("");
		} finally {
			setBusy(false);
		}
	}

	return (
		<div class={`flex flex-col gap-4 ${props.class ?? ""}`}>
			<Card>
				<CardHeader>
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<h2 class="text-base font-semibold">{props.title ?? "Members"}</h2>
							<p class="text-sm text-muted-foreground">
								{props.description ?? "People with access to this workspace."}
							</p>
						</div>
						<Badge variant="outline">{props.members?.length ?? 0} members</Badge>
					</div>
				</CardHeader>
				<CardContent class="flex flex-col gap-4">
					<MembersTable
						members={props.members}
						rowActions={(member) => (
							<div class="flex items-center gap-2">
								<Select
									size="sm"
									fullWidth={false}
									value={member.role ?? role()}
									onChange={(value) => props.onRoleChange?.(member, value)}
								>
									<For each={roles()}>{(item) => <option value={item}>{item}</option>}</For>
								</Select>
								<Button size="sm" variant="ghost" onClick={() => props.onRemove?.(member)}>
									Remove
								</Button>
							</div>
						)}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<h3 class="text-base font-semibold">Invite people</h3>
				</CardHeader>
				<CardContent class="flex flex-col gap-4">
					<form class="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={invite}>
						<div class="flex flex-1 flex-col gap-1.5">
							<Label htmlFor="invite-email">Email</Label>
							<Input
								id="invite-email"
								type="email"
								value={email()}
								placeholder="teammate@company.com"
								error={email().length > 0 && !valid()}
								onChange={setEmail}
							/>
						</div>
						<div class="flex w-full flex-col gap-1.5 sm:w-40">
							<Label htmlFor="invite-role">Role</Label>
							<Select id="invite-role" value={role()} onChange={setRole}>
								<For each={roles()}>{(item) => <option value={item}>{item}</option>}</For>
							</Select>
						</div>
						<Button type="submit" variant="primary" disabled={!valid() || busy()}>
							{busy() ? "Sending…" : "Send invite"}
						</Button>
					</form>

					<Show when={props.pending?.length}>
						<Divider />
						<div class="flex flex-col gap-2">
							<p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pending invites</p>
							<For each={props.pending}>
								{(member) => (
									<div class="flex items-center justify-between gap-3 text-sm">
										<span class="truncate">{member.sub ?? member.name}</span>
										<Badge variant="warning">Invited · {member.role ?? "Member"}</Badge>
									</div>
								)}
							</For>
						</div>
					</Show>
				</CardContent>
			</Card>
		</div>
	);
}
