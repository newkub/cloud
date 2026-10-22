/**
 * OAuthButtons - "Continue with X" provider buttons for auth screens.
 */
import { For, type JSX, splitProps } from "solid-js";
import { Button } from "./Button";

export interface OAuthProvider {
	/** Provider id passed to onSelect (e.g. "google", "github"). */
	id: string;
	/** Button label; defaults to `Continue with {id}`. */
	label?: string;
	/** Custom icon/brand mark. */
	icon?: JSX.Element;
}

export interface OAuthButtonsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Providers to render. */
	providers: OAuthProvider[];
	/** Called with the picked provider id. */
	onSelect?: (id: string) => void;
	/** Stack buttons vertically. @default true */
	vertical?: boolean;
}

export function OAuthButtons(props: OAuthButtonsProps) {
	const [local, rest] = splitProps(props, ["class", "providers", "onSelect", "vertical"]);

	const className = () =>
		[
			"solidui-oauth-buttons",
			(local.vertical ?? true) ? "flex flex-col gap-2" : "flex flex-wrap gap-2",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<For each={local.providers}>
				{(p) => (
					<Button variant="secondary" class="w-full justify-center gap-2" onClick={() => local.onSelect?.(p.id)}>
						{p.icon}
						{p.label ?? `Continue with ${p.id[0].toUpperCase()}${p.id.slice(1)}`}
					</Button>
				)}
			</For>
		</div>
	);
}
