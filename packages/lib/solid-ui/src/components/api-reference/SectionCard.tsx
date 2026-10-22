import { type JSX, Show } from "solid-js";

export function SectionCard(props: {
	title: string;
	icon?: JSX.Element;
	children: JSX.Element;
	actions?: JSX.Element;
}) {
	return (
		<section class="border border-border rounded-xl bg-surface/30 overflow-hidden mb-6">
			<header class="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-background/50">
				<Show when={props.icon}>{(i) => <span class="text-primary">{i()}</span>}</Show>
				<h2 class="text-sm font-semibold text-foreground m-0">{props.title}</h2>
				<div class="ml-auto">{props.actions}</div>
			</header>
			<div class="p-4">{props.children}</div>
		</section>
	);
}
