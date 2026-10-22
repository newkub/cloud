/**
 * FavoriteButton - heart/star toggle for like/bookmark/favorite actions.
 */
import { createSignal, type JSX, splitProps } from "solid-js";
import { iconPaths } from "../lib/icons";

export interface FavoriteButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
	/** Controlled active state. */
	active?: boolean;
	/** Called with the next state. */
	onChange?: (active: boolean) => void;
	/** Icon kind. @default "heart" */
	icon?: "heart" | "star" | "bookmark";
	/** Count shown next to the icon (e.g. like count). */
	count?: number;
	/** Accessible labels. */
	labels?: { on?: string; off?: string };
}

const defaultLabels = { on: "Remove from favorites", off: "Add to favorites" };

export function FavoriteButton(props: FavoriteButtonProps) {
	const [local, rest] = splitProps(props, ["class", "active", "onChange", "icon", "count", "labels"]);
	const [internal, setInternal] = createSignal(false);

	const active = () => local.active ?? internal();
	const toggle = () => {
		const next = !active();
		setInternal(next);
		local.onChange?.(next);
	};

	const label = () => (active() ? (local.labels?.on ?? defaultLabels.on) : (local.labels?.off ?? defaultLabels.off));

	return (
		<button
			type="button"
			class={`solidui-favorite-button inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
				active() ? "text-destructive" : "text-muted-foreground hover:text-foreground"
			} ${local.class ?? ""}`}
			aria-label={label()}
			aria-pressed={active()}
			onClick={toggle}
			{...rest}
		>
			<svg
				class={`h-4 w-4 transition-transform ${active() ? "scale-110" : ""}`}
				viewBox="0 0 24 24"
				fill={active() ? "currentColor" : "none"}
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				{iconPaths[local.icon ?? "heart"]}
			</svg>
			{local.count !== undefined ? <span>{local.count}</span> : null}
		</button>
	);
}
