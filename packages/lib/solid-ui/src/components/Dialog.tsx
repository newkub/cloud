/**
 * Dialog component — flat props API plus compound parts
 * (`<Dialog.Header>`, `<Dialog.Title>`, `<Dialog.Description>`,
 * `<Dialog.Body>`, `<Dialog.Footer>`, `<Dialog.Close>`).
 * Parts live in `./dialog/` — this file keeps the public entry point.
 */

import { type Component, type JSX, mergeProps, Show } from "solid-js";
import { DialogContent } from "./dialog/content";
import {
	DialogBody,
	DialogClose,
	DialogDescription,
	type DialogDescriptionProps,
	DialogFooter,
	DialogHeader,
	type DialogPartProps,
	DialogTitle,
	type DialogTitleProps,
} from "./dialog/parts";
import type { DialogProps } from "./dialog/types";

export type { DialogProps } from "./dialog/types";

interface DialogComponent extends Component<DialogProps> {
	Header: Component<DialogPartProps>;
	Title: Component<DialogTitleProps>;
	Description: Component<DialogDescriptionProps>;
	Body: Component<DialogPartProps>;
	Footer: Component<DialogPartProps>;
	Close: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>>;
}

export const Dialog: DialogComponent = Object.assign(
	(props: DialogProps) => {
		const merged = mergeProps({ open: false }, props);
		return (
			<Show when={merged.open}>
				<DialogContent
					onOpenChange={merged.onOpenChange}
					title={merged.title}
					description={merged.description}
					variant={merged.variant}
					size={merged.size}
					radius={merged.radius}
					elevation={merged.elevation}
					unstyled={merged.unstyled}
					class={merged.class}
				>
					{merged.children}
				</DialogContent>
			</Show>
		);
	},
	{
		Header: DialogHeader,
		Title: DialogTitle,
		Description: DialogDescription,
		Body: DialogBody,
		Footer: DialogFooter,
		Close: DialogClose,
	},
);
