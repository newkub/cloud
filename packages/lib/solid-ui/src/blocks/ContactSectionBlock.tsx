import { createSignal, For, Show, type JSX } from "solid-js";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card, CardContent, CardHeader } from "../components/Card";
import { Divider } from "../components/Divider";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { Select } from "../components/Select";
import { Textarea } from "../components/Textarea";

export interface ContactChannel {
	label: string;
	value: string;
	hint?: string;
	href?: string;
}

export interface ContactSectionBlockProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
	title?: string;
	description?: string;
	/** Topics available in the subject select. */
	topics?: string[];
	channels?: ContactChannel[];
	submitLabel?: string;
	successMessage?: string;
	onSubmit?: (values: { name: string; email: string; topic: string; message: string }) => void | Promise<void>;
}

/** A two-column contact section: message form beside reachable channels. */
export function ContactSectionBlock(props: ContactSectionBlockProps) {
	const [name, setName] = createSignal("");
	const [email, setEmail] = createSignal("");
	const [topic, setTopic] = createSignal("");
	const [message, setMessage] = createSignal("");
	const [sent, setSent] = createSignal(false);
	const [busy, setBusy] = createSignal(false);

	const valid = () =>
		name().trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email()) && message().trim().length > 9;

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (!valid() || busy()) return;
		setBusy(true);
		try {
			await props.onSubmit?.({ name: name(), email: email(), topic: topic(), message: message() });
			setSent(true);
		} finally {
			setBusy(false);
		}
	}

	return (
		<div class={`grid gap-6 lg:grid-cols-[1.4fr_1fr] ${props.class ?? ""}`}>
			<Card>
				<CardHeader>
					<h2 class="text-xl font-semibold tracking-tight">{props.title ?? "Talk to our team"}</h2>
					<p class="text-sm text-muted-foreground">
						{props.description ?? "Tell us what you are building and we will get back within one business day."}
					</p>
				</CardHeader>
				<CardContent>
					<Show
						when={!sent()}
						fallback={
							<p class="rounded-md border border-success/30 bg-success/10 px-4 py-6 text-center text-sm text-success" role="status">
								{props.successMessage ?? "Thanks — your message is on its way."}
							</p>
						}
					>
						<form class="flex flex-col gap-4" onSubmit={submit} novalidate>
							<div class="grid gap-4 sm:grid-cols-2">
								<div class="flex flex-col gap-1.5">
									<Label htmlFor="contact-name" required>
										Name
									</Label>
									<Input id="contact-name" value={name()} autocomplete="name" onChange={setName} />
								</div>
								<div class="flex flex-col gap-1.5">
									<Label htmlFor="contact-email" required>
										Work email
									</Label>
									<Input
										id="contact-email"
										type="email"
										value={email()}
										autocomplete="email"
										error={email().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email())}
										onChange={setEmail}
									/>
								</div>
							</div>
							<Show when={props.topics?.length}>
								<div class="flex flex-col gap-1.5">
									<Label htmlFor="contact-topic">Topic</Label>
									<Select id="contact-topic" value={topic()} placeholder="Choose a topic" onChange={setTopic}>
										<For each={props.topics}>
											{(item) => <option value={item}>{item}</option>}
										</For>
									</Select>
								</div>
							</Show>
							<div class="flex flex-col gap-1.5">
								<Label htmlFor="contact-message" required>
									Message
								</Label>
								<Textarea
									id="contact-message"
									rows={5}
									value={message()}
									placeholder="What can we help with?"
									onChange={setMessage}
								/>
								<p class="text-xs text-muted-foreground">{message().trim().length}/2000 characters</p>
							</div>
							<Button type="submit" variant="primary" disabled={!valid() || busy()}>
								{busy() ? "Sending…" : (props.submitLabel ?? "Send message")}
							</Button>
						</form>
					</Show>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<h3 class="text-base font-semibold">Other ways to reach us</h3>
				</CardHeader>
				<CardContent class="flex flex-col gap-4">
					<For each={props.channels ?? []}>
						{(channel, index) => (
							<>
								<Show when={index() > 0}>
									<Divider />
								</Show>
								<div class="flex flex-col gap-1">
									<Badge variant="outline">{channel.label}</Badge>
									{channel.href ? (
										<a class="text-sm font-medium text-primary hover:underline" href={channel.href}>
											{channel.value}
										</a>
									) : (
										<p class="text-sm font-medium">{channel.value}</p>
									)}
									<Show when={channel.hint}>
										<p class="text-xs text-muted-foreground">{channel.hint}</p>
									</Show>
								</div>
							</>
						)}
					</For>
				</CardContent>
			</Card>
		</div>
	);
}
