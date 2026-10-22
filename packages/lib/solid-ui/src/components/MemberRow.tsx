/**
 * MemberRow - team member row with avatar, name, role badge and actions slot.
 */
import { type JSX, splitProps } from "solid-js";
import { AvatarName } from "./AvatarName";
import { Badge } from "./Badge";

export interface MemberRowProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "role"> {
	/** Member display name. */
	name: string;
	/** Secondary line — email or handle. */
	sub?: string;
	/** Avatar image URL. */
	src?: string;
	/** Role label shown as a badge. */
	role?: string;
	/** Pending invite state — dims the row. @default false */
	pending?: boolean;
	/** Trailing actions slot (menu, remove button…). */
	actions?: JSX.Element;
}

export function MemberRow(props: MemberRowProps) {
	const [local, rest] = splitProps(props, ["class", "name", "sub", "src", "role", "pending", "actions"]);

	const className = () =>
		[
			"solidui-member-row flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/50",
			local.pending ? "opacity-60" : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<AvatarName name={local.name} src={local.src} subtitle={local.sub} />
			<span class="flex-1" />
			{local.role ? <Badge variant="secondary">{local.role}</Badge> : null}
			{local.pending ? <Badge variant="outline">Pending</Badge> : null}
			{local.actions}
		</div>
	);
}
