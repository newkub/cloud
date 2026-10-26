import { For, type JSX } from "solid-js";
import { Marquee } from "../components/Marquee";

export interface LogoMarqueeItem {
	name: string;
	/** Rendered as the mark; a text name when omitted. */
	mark?: JSX.Element;
	href?: string;
}

export interface LogoMarqueeBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title?: string;
	items: LogoMarqueeItem[];
	/** Seconds per loop @default 40 */
	speed?: number;
	pauseOnHover?: boolean;
	reverse?: boolean;
}

/** A quiet, continuously moving row of customer marks with a hover pause. */
export function LogoMarqueeBlock(props: LogoMarqueeBlockProps) {
	return (
		<div class={`flex flex-col gap-4 ${props.class ?? ""}`}>
			{props.title && (
				<p class="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
					{props.title}
				</p>
			)}
			<Marquee speed={props.speed ?? 40} pauseOnHover={props.pauseOnHover ?? true} reverse={props.reverse}>
				<For each={props.items}>
					{(item) =>
						item.href ? (
							<a
								href={item.href}
								class="px-6 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
							>
								{item.mark ?? item.name}
							</a>
						) : (
							<span class="px-6 text-sm font-semibold text-muted-foreground">{item.mark ?? item.name}</span>
						)
					}
				</For>
			</Marquee>
		</div>
	);
}
