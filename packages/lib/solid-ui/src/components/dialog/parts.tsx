/** Compound parts — `<Dialog.Header>`, `<Dialog.Title>`, `<Dialog.Description>`,
 * `<Dialog.Body>`, `<Dialog.Footer>`, `<Dialog.Close>`. */
import { type JSX, splitProps } from "solid-js";
import { useDialogContext } from "./context";

/** Compound-part props shared by Dialog.* sub-components. */
export interface DialogPartProps extends JSX.HTMLAttributes<HTMLDivElement> {
	children?: JSX.Element;
}
export interface DialogTitleProps extends JSX.HTMLAttributes<HTMLHeadingElement> {
	children?: JSX.Element;
}
export interface DialogDescriptionProps extends JSX.HTMLAttributes<HTMLParagraphElement> {
	children?: JSX.Element;
}

export function DialogHeader(props: DialogPartProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);
	const ctx = useDialogContext();
	return (
		<div class={ctx.unstyled ? (local.class ?? "") : `mb-4 space-y-1 ${local.class ?? ""}`.trim()} {...rest}>
			{local.children}
		</div>
	);
}

export function DialogTitle(props: DialogTitleProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);
	const ctx = useDialogContext();
	return (
		<h2
			id={ctx.titleId}
			class={ctx.unstyled ? (local.class ?? "") : `text-lg font-semibold text-foreground ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.children}
		</h2>
	);
}

export function DialogDescription(props: DialogDescriptionProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);
	const ctx = useDialogContext();
	return (
		<p
			id={ctx.descriptionId}
			class={ctx.unstyled ? (local.class ?? "") : `mt-1 text-sm text-muted-foreground ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.children}
		</p>
	);
}

export function DialogBody(props: DialogPartProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);
	const ctx = useDialogContext();
	return (
		<div class={ctx.unstyled ? (local.class ?? "") : `mt-4 ${local.class ?? ""}`.trim()} {...rest}>
			{local.children}
		</div>
	);
}

export function DialogFooter(props: DialogPartProps) {
	const [local, rest] = splitProps(props, ["class", "children"]);
	const ctx = useDialogContext();
	return (
		<div
			class={ctx.unstyled ? (local.class ?? "") : `mt-6 flex justify-end gap-2 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.children}
		</div>
	);
}

export function DialogClose(props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) {
	const [local, rest] = splitProps(props, ["class", "children", "onClick"]);
	const ctx = useDialogContext();
	return (
		<button
			type="button"
			class={
				ctx.unstyled
					? (local.class ?? "")
					: `absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${local.class ?? ""}`.trim()
			}
			aria-label="Close dialog"
			onClick={(e) => {
				(local.onClick as ((ev: MouseEvent) => void) | undefined)?.(e);
				ctx.onOpenChange?.(false);
			}}
			{...rest}
		>
			{local.children ?? (
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			)}
		</button>
	);
}
