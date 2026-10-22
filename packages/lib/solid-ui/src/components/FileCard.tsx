/**
 * FileCard - uploaded file row with icon, name, meta and remove action.
 */
import { type JSX, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";
import { type Radius, radiusMap } from "../lib/variants";

export interface FileCardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** File name. */
	name: string;
	/** Meta line, e.g. "2.4 MB · PDF". */
	meta?: string;
	/** Icon name. @default "file" */
	icon?: string;
	/** Upload progress 0..1; shows a thin bar when set. */
	progress?: number;
	/** Called when the remove button is pressed; hides it when omitted. */
	onRemove?: () => void;
	/** Corner radius. */
	radius?: Radius;
}

export function FileCard(props: FileCardProps) {
	const [local, rest] = splitProps(props, ["class", "name", "meta", "icon", "progress", "onRemove", "radius"]);

	const className = () =>
		[
			"solidui-file-card flex items-center gap-3 p-3 border border-border bg-card",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} {...rest}>
			<span class="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
				<NamedIcon name={local.icon ?? "file"} class="h-4 w-4" />
			</span>
			<span class="flex-1 min-w-0">
				<span class="block truncate text-sm font-medium text-foreground">{local.name}</span>
				{local.meta ? <span class="block text-xs text-muted-foreground">{local.meta}</span> : null}
				{local.progress !== undefined ? (
					<span class="mt-1 block h-1 w-full rounded-full bg-muted overflow-hidden">
						<span
							class="block h-full bg-primary transition-all"
							style={{ width: `${Math.min(100, Math.max(0, local.progress * 100))}%` }}
						/>
					</span>
				) : null}
			</span>
			{local.onRemove ? (
				<button
					type="button"
					class="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					aria-label={`Remove ${local.name}`}
					onClick={local.onRemove}
				>
					<NamedIcon name="x" class="h-4 w-4" />
				</button>
			) : null}
		</div>
	);
}
