import { useFocusScope } from "@wrikka/hooks";
import { onCleanup, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { elevationMap, paddingSizes, radiusMap, type SurfaceVariant, surfaceVariants } from "../../lib/variants";
import { DialogContext, type DialogContextValue } from "./context";
import type { DialogProps } from "./types";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-surface shadow-lg",
};

let dialogCount = 0;
/** Mount order of open dialogs; only the topmost one handles Escape. */
const openDialogs: symbol[] = [];

export function DialogContent(props: DialogProps) {
	let contentRef: HTMLDivElement | undefined;
	const id = ++dialogCount;
	const dialogKey = Symbol("dialog");
	const ctx: DialogContextValue = {
		titleId: `dialog-title-${id}`,
		descriptionId: `dialog-description-${id}`,
		onOpenChange: props.onOpenChange,
		unstyled: props.unstyled,
	};

	useFocusScope(() => contentRef);

	onMount(() => {
		openDialogs.push(dialogKey);
		// Listen on the document (capture) so Escape still closes the dialog
		// when focus sits outside it, and so page-level shortcuts don't run.
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape" || openDialogs[openDialogs.length - 1] !== dialogKey) return;
			event.preventDefault();
			event.stopPropagation();
			props.onOpenChange?.(false);
		};
		document.addEventListener("keydown", onKeyDown, true);

		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		onCleanup(() => {
			document.removeEventListener("keydown", onKeyDown, true);
			const index = openDialogs.indexOf(dialogKey);
			if (index !== -1) openDialogs.splice(index, 1);
			document.body.style.overflow = prevOverflow;
		});
	});

	const bare = props.unstyled;
	return (
		<Portal>
			<div
				class={`fixed inset-0 z-modal-backdrop ${bare ? "" : "bg-overlay/80 motion-safe:animate-[su-fade-in_var(--su-transition-normal)]"}`.trim()}
				onClick={() => props.onOpenChange?.(false)}
				aria-hidden="true"
			/>
			<div class="fixed inset-0 z-modal flex items-center justify-center p-4 pointer-events-none" role="presentation">
				<div
					ref={(el) => (contentRef = el)}
					tabIndex={-1}
					class={
						bare
							? `pointer-events-auto relative max-h-[90dvh] w-full max-w-lg overflow-y-auto ${props.class ?? ""}`.trim()
							: `pointer-events-auto relative max-h-[90dvh] w-full max-w-lg overflow-y-auto border motion-safe:animate-[su-zoom-in_var(--su-transition-normal)] ${variantMap[props.variant ?? "default"]} ${paddingSizes[props.size ?? "lg"]} ${radiusMap[props.radius ?? "xl"]} ${props.elevation ? elevationMap[props.elevation] : ""} ${props.class ?? ""}`
					}
					role="dialog"
					aria-modal="true"
					aria-labelledby={props.title ? ctx.titleId : undefined}
					aria-describedby={props.description ? ctx.descriptionId : undefined}
				>
					<DialogContext.Provider value={ctx}>
						<Show when={props.title}>
							<h2 id={ctx.titleId} class={bare ? "" : "text-lg font-semibold text-foreground"}>
								{props.title}
							</h2>
						</Show>
						<Show when={props.description}>
							<p id={ctx.descriptionId} class={bare ? "" : "mt-1 text-sm text-muted-foreground"}>
								{props.description}
							</p>
						</Show>
						<div class={bare ? "" : "mt-4"}>{props.children}</div>
					</DialogContext.Provider>
				</div>
			</div>
		</Portal>
	);
}
