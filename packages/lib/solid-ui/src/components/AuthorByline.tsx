/**
 * AuthorByline — avatar + name + meta row (posts, comments, docs).
 */
import { type JSX, Show, splitProps } from "solid-js";

export interface AuthorBylineProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "role"> {
	name: string;
	/** Role/handle under the name. */
	role?: string;
	/** Date or read-time text. */
	date?: string;
	avatar?: string;
	/** Link for the name. */
	href?: string;
	/** Trailing slot (follow button, badge). */
	trailing?: JSX.Element;
	size?: "sm" | "md" | "lg";
	/** Stack name over meta instead of inline. @default true */
	stacked?: boolean;
}

const avatarCls = { sm: "h-6 w-6 text-2xs", md: "h-8 w-8 text-xs", lg: "h-10 w-10 text-sm" } as const;
const nameSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

export function AuthorByline(props: AuthorBylineProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"name",
		"role",
		"date",
		"avatar",
		"href",
		"trailing",
		"size",
		"stacked",
	]);
	const name = () =>
		local.href ? (
			<a
				href={local.href}
				class={`rounded-sm font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${nameSize[local.size ?? "md"]}`}
			>
				{local.name}
			</a>
		) : (
			<span class={`font-medium text-foreground ${nameSize[local.size ?? "md"]}`}>{local.name}</span>
		);
	const meta = () => (
		<Show when={local.role || local.date}>
			<span class="text-2xs text-muted-foreground">{[local.role, local.date].filter(Boolean).join(" · ")}</span>
		</Show>
	);
	return (
		<div class={`solidui-author-byline inline-flex items-center gap-2.5 ${local.class ?? ""}`.trim()} {...rest}>
			<span
				class={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 font-semibold text-primary ${avatarCls[local.size ?? "md"]}`}
			>
				{local.avatar ? (
					<img src={local.avatar} alt={local.name} class="h-full w-full object-cover" />
				) : (
					(local.name ?? "").charAt(0).toUpperCase()
				)}
			</span>
			<Show
				when={local.stacked ?? true}
				fallback={
					<span class="flex items-baseline gap-2">
						{name()}
						{meta()}
					</span>
				}
			>
				<span class="flex min-w-0 flex-col">
					{name()}
					{meta()}
				</span>
			</Show>
			<Show when={local.trailing}>
				<span class="ml-2">{local.trailing}</span>
			</Show>
		</div>
	);
}
