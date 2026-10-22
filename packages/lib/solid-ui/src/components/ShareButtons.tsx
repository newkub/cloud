/**
 * ShareButtons - row of social share actions plus copy-link.
 */
import { For, type JSX, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface ShareTarget {
	/** Target id passed to onShare (e.g. "x", "facebook", "email"). */
	id: string;
	/** Accessible label. */
	label: string;
	/** Icon name or custom JSX. */
	icon?: JSX.Element | string;
}

export interface ShareButtonsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect"> {
	/** Share targets. */
	targets: ShareTarget[];
	/** URL shared/copied. */
	url?: string;
	/** Called when a target is picked. */
	onShare?: (id: string, url?: string) => void;
	/** Add a trailing copy-link button. @default true */
	copyLink?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

export function ShareButtons(props: ShareButtonsProps) {
	const [local, rest] = splitProps(props, ["class", "targets", "url", "onShare", "copyLink", "radius"]);

	const copy = async () => {
		if (local.url) await navigator.clipboard?.writeText(local.url);
		local.onShare?.("copy", local.url);
	};

	const className = () =>
		["solidui-share-buttons inline-flex items-center gap-1", local.class ?? ""].filter(Boolean).join(" ");

	const btn = `inline-flex h-8 w-8 items-center justify-center border border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`;

	return (
		// biome-ignore lint/a11y/useSemanticElements: button group, not a form fieldset
		<div class={className()} role="group" aria-label="Share" {...rest}>
			<For each={local.targets}>
				{(t) => (
					<button
						type="button"
						class={`${btn} ${radiusMap[local.radius ?? "md"]}`}
						aria-label={t.label}
						title={t.label}
						onClick={() => local.onShare?.(t.id, local.url)}
					>
						{typeof t.icon === "string" ? <NamedIcon name={t.icon} class="h-4 w-4" /> : (t.icon ?? t.label[0])}
					</button>
				)}
			</For>
			{(local.copyLink ?? true) ? (
				<button
					type="button"
					class={`${btn} ${radiusMap[local.radius ?? "md"]}`}
					aria-label="Copy link"
					title="Copy link"
					onClick={copy}
				>
					<NamedIcon name="link" class="h-4 w-4" />
				</button>
			) : null}
		</div>
	);
}
