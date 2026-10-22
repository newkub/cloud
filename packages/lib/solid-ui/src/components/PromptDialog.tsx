/**
 * PromptDialog — modal shell (same portal/focus-trap pattern as AlertDialog) with a
 * text input, Enter-to-submit and required/pattern validation.
 */
import { createFocusTrap, useEscapeKey } from "@wrikka/hooks";
import { type Accessor, createSignal, type JSX, onCleanup, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";
import { FieldError } from "./FieldError";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-surface shadow-lg",
};

export interface PromptDialogProps {
	/** Visibility — accepts a boolean or an accessor. */
	open?: boolean | Accessor<boolean>;
	onOpenChange?: (open: boolean) => void;
	title: JSX.Element;
	/** Label shown above the input. */
	label?: string;
	placeholder?: string;
	/** Initial input value. */
	defaultValue?: string;
	/** Called with the submitted value when valid. */
	onResolve?: (value: string) => void;
	onCancel?: () => void;
	/** @default "OK" */
	confirmLabel?: string;
	/** @default "Cancel" */
	cancelLabel?: string;
	inputMode?: "text" | "email" | "numeric" | "tel" | "url" | "search" | "decimal";
	/** Require a non-empty value before submitting. */
	required?: boolean;
	/** Regex source the value must match before submitting. */
	pattern?: string;
	variant?: "default" | "outline" | "ghost" | "elevated" | "filled" | "primary";
	size?: "sm" | "md" | "lg";
	class?: string;
	/** Corner radius. @default "xl" */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

let promptDialogCount = 0;

function PromptDialogContent(props: PromptDialogProps) {
	let contentRef: HTMLDivElement | undefined;
	let inputRef: HTMLInputElement | undefined;
	const id = ++promptDialogCount;
	const [value, setValue] = createSignal(props.defaultValue ?? "");
	const [error, setError] = createSignal("");
	const close = () => props.onOpenChange?.(false);

	const cancel = () => {
		setError("");
		props.onCancel?.();
		close();
	};

	const submit = () => {
		const v = value();
		if (props.required && !v.trim()) {
			setError("This field is required.");
			return;
		}
		if (props.pattern && !new RegExp(props.pattern).test(v)) {
			setError("Value does not match the required pattern.");
			return;
		}
		setError("");
		props.onResolve?.(v);
		close();
	};

	useEscapeKey(cancel);

	onMount(() => {
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const trap = contentRef ? createFocusTrap(contentRef) : null;
		trap?.activate();
		inputRef?.focus();
		onCleanup(() => {
			document.body.style.overflow = prevOverflow;
			trap?.deactivate();
		});
	});

	return (
		<Portal>
			<div
				class="fixed inset-0 z-modal-backdrop bg-overlay/80 motion-safe:animate-[su-fade-in_var(--su-transition-normal)]"
				onClick={cancel}
				aria-hidden="true"
			/>
			<div class="pointer-events-none fixed inset-0 z-modal flex items-center justify-center p-4" role="presentation">
				<div
					ref={(el) => (contentRef = el)}
					tabIndex={-1}
					class={`pointer-events-auto max-h-[90dvh] w-full max-w-sm overflow-y-auto border motion-safe:animate-[su-zoom-in_var(--su-transition-normal)] ${variantMap[props.variant ?? "default"]} ${paddingSizes[props.size ?? "lg"]} ${radiusMap[props.radius ?? "xl"]} ${props.elevation ? elevationMap[props.elevation] : ""} ${props.class ?? ""}`}
					role="dialog"
					aria-modal="true"
					aria-labelledby={`prompt-dialog-title-${id}`}
				>
					<h2 id={`prompt-dialog-title-${id}`} class="text-lg font-semibold text-foreground">
						{props.title}
					</h2>
					<Show when={props.label}>
						<label class="mt-4 block text-sm font-medium text-foreground" for={`prompt-dialog-input-${id}`}>
							{props.label}
						</label>
					</Show>
					<input
						ref={(el) => (inputRef = el)}
						id={`prompt-dialog-input-${id}`}
						type="text"
						class="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						placeholder={props.placeholder}
						inputMode={props.inputMode}
						value={value()}
						aria-invalid={!!error() || undefined}
						onInput={(e) => {
							setValue(e.currentTarget.value);
							if (error()) setError("");
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								submit();
							}
						}}
					/>
					<FieldError message={error()} />
					<div class="mt-5 flex justify-end gap-2">
						<button
							type="button"
							class="min-h-9 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm font-medium text-foreground motion-safe:transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							onClick={cancel}
						>
							{props.cancelLabel ?? "Cancel"}
						</button>
						<button
							type="button"
							class="min-h-9 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground motion-safe:transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							onClick={submit}
						>
							{props.confirmLabel ?? "OK"}
						</button>
					</div>
				</div>
			</div>
		</Portal>
	);
}

export function PromptDialog(props: PromptDialogProps) {
	const isOpen = () => (typeof props.open === "function" ? props.open() : !!props.open);
	return (
		<Show when={isOpen()}>
			<PromptDialogContent {...props} />
		</Show>
	);
}
