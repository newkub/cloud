/**
 * TagCloud — weighted word cloud; tag size scales with weight.
 */
import { For, type JSX, splitProps } from "solid-js";

export interface TagCloudItem {
	label: string;
	/** Relative importance — drives font size. @default 1 */
	weight?: number;
	href?: string;
	onClick?: (item: TagCloudItem) => void;
	/** Optional color class, e.g. "text-primary". */
	color?: string;
}

export interface TagCloudProps extends JSX.HTMLAttributes<HTMLDivElement> {
	items: TagCloudItem[];
	/** Min/max font size in rem. @default 0.7–1.6 */
	minRem?: number;
	maxRem?: number;
	/** Order by weight (largest first). @default false — keeps input order */
	sort?: boolean;
	/** Default tag tone — items can override via `color`. @default "default" */
	variant?: "default" | "muted" | "primary";
}

export function TagCloud(props: TagCloudProps) {
	const tagTones = { default: "text-foreground", muted: "text-muted-foreground", primary: "text-primary" } as const;
	const [local, rest] = splitProps(props, ["class", "items", "minRem", "maxRem", "sort", "variant"]);
	const weights = () => (local.items ?? []).map((i) => i.weight ?? 1);
	const lo = () => Math.min(...weights(), 1);
	const hi = () => Math.max(...weights(), 1);
	const fontSize = (w: number) => {
		const min = local.minRem ?? 0.7;
		const max = local.maxRem ?? 1.6;
		const t = hi() === lo() ? 0.5 : (w - lo()) / (hi() - lo());
		return min + t * (max - min);
	};
	const ordered = () =>
		local.sort ? [...(local.items ?? [])].sort((a, b) => (b.weight ?? 1) - (a.weight ?? 1)) : (local.items ?? []);
	const cls = (item: TagCloudItem) =>
		`inline-block rounded px-1 leading-tight transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${item.color ?? tagTones[local.variant ?? "default"]}`;

	return (
		<div
			class={`solidui-tag-cloud flex flex-wrap items-baseline gap-x-2 gap-y-1 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={ordered()}>
				{(item) =>
					item.href ? (
						<a href={item.href} class={cls(item)} style={{ "font-size": `${fontSize(item.weight ?? 1)}rem` }}>
							{item.label}
						</a>
					) : item.onClick ? (
						<button
							type="button"
							class={cls(item)}
							style={{ "font-size": `${fontSize(item.weight ?? 1)}rem` }}
							onClick={() => item.onClick?.(item)}
						>
							{item.label}
						</button>
					) : (
						<span class={cls(item)} style={{ "font-size": `${fontSize(item.weight ?? 1)}rem` }}>
							{item.label}
						</span>
					)
				}
			</For>
		</div>
	);
}
