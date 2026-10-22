import { For, type JSX } from "solid-js";
import { Avatar, AvatarFallback } from "../components/Avatar";
import { Button } from "../components/Button";
import { Divider } from "../components/Divider";

export interface NavLink {
	label: string;
	href: string;
	active?: boolean;
}

export interface NavbarBlockProps extends JSX.HTMLAttributes<HTMLElement> {
	brand: string;
	links: NavLink[];
	/** User initials shown in the trailing avatar. */
	userInitials?: string;
	ctaLabel?: string;
	onCta?: () => void;
}

/** Composed navbar — brand, link list, optional CTA and user avatar. */
export function NavbarBlock(props: NavbarBlockProps) {
	return (
		<header class={props.class}>
			<nav class="flex items-center gap-6 px-4 py-3" aria-label="Main">
				<span class="text-base font-bold tracking-tight">{props.brand}</span>
				<ul class="hidden flex-1 items-center gap-1 sm:flex">
					<For each={props.links}>
						{(l) => (
							<li>
								<a
									href={l.href}
									aria-current={l.active ? "page" : undefined}
									class={`rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
										l.active ? "font-medium text-foreground" : "text-muted-foreground"
									}`}
								>
									{l.label}
								</a>
							</li>
						)}
					</For>
				</ul>
				<div class="ml-auto flex items-center gap-3">
					{props.ctaLabel && (
						<Button variant="primary" size="sm" onClick={() => props.onCta?.()}>
							{props.ctaLabel}
						</Button>
					)}
					{props.userInitials && (
						<Avatar class="h-8 w-8">
							<AvatarFallback>{props.userInitials}</AvatarFallback>
						</Avatar>
					)}
				</div>
			</nav>
			<Divider />
		</header>
	);
}
