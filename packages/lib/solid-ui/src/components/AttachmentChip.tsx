/**
 * AttachmentChip - compact file chip with name, size and remove action.
 */
import { type JSX, splitProps } from "solid-js";
import { NamedIcon } from "../lib/icons";

export interface AttachmentChipProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** File name shown in the chip. */
	name: string;
	/** Optional size label, e.g. "12 KB". */
	size?: string;
	/** Icon name for the file type. @default "paperclip" */
	icon?: string;
	/** Called when the remove button is pressed; hides it when omitted. */
	onRemove?: () => void;
}

export function AttachmentChip(props: AttachmentChipProps) {
	const [local, rest] = splitProps(props, ["class", "name", "size", "icon", "onRemove"]);

	const className = () =>
		[
			"solidui-attachment-chip inline-flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-full border border-border bg-muted text-foreground",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<span class={className()} {...rest}>
			<NamedIcon name={local.icon ?? "paperclip"} class="h-3 w-3 text-muted-foreground" />
			<span class="truncate max-w-[160px]">{local.name}</span>
			{local.size ? <span class="text-muted-foreground">{local.size}</span> : null}
			{local.onRemove ? (
				<button
					type="button"
					class="inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					aria-label={`Remove ${local.name}`}
					onClick={local.onRemove}
				>
					<NamedIcon name="x" class="h-3 w-3" />
				</button>
			) : null}
		</span>
	);
}
