/**
 * MembersTable - simple member list table with role column and per-row actions.
 */
import { For, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";
import { MemberRow } from "./MemberRow";

export interface Member {
	/** Unique id. */
	id: string;
	/** Display name. */
	name: string;
	/** Email or handle. */
	sub?: string;
	/** Avatar URL. */
	src?: string;
	/** Role label. */
	role?: string;
	/** Pending invite. */
	pending?: boolean;
}

export interface MembersTableProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Members to list. */
	members?: Member[];
	/** Row actions renderer. */
	rowActions?: (member: Member) => JSX.Element;
	/** Empty-state message. @default "No members" */
	empty?: string;
	/** Corner radius. */
	radius?: Radius;
}

export function MembersTable(props: MembersTableProps) {
	const [local, rest] = splitProps(props, ["class", "members", "rowActions", "empty", "radius"]);

	const className = () =>
		[
			"solidui-members-table border border-border bg-card divide-y divide-border",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		// biome-ignore lint/a11y/useSemanticElements: styled member list, rows are custom components
		<div class={className()} role="table" aria-label="Members" {...rest}>
			{(local.members ?? []).length === 0 ? (
				<p class="p-6 text-center text-sm text-muted-foreground">{local.empty ?? "No members"}</p>
			) : (
				<For each={local.members ?? []}>
					{(m) => (
						<MemberRow
							name={m.name}
							sub={m.sub}
							src={m.src}
							role={m.role}
							pending={m.pending}
							actions={local.rowActions?.(m)}
						/>
					)}
				</For>
			)}
		</div>
	);
}
