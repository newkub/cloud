import { type Accessor, createSignal } from "solid-js";

export interface UseModalOptions<P> {
	/** Start open. @default false */
	initialOpen?: boolean;
	/** Called on show/toggle-open with the payload. */
	onShow?: (payload: P | undefined) => void;
	/** Called when an open modal closes. */
	onHide?: () => void;
}

export interface ModalControls<P = unknown> {
	/** Whether the modal is open. */
	open: Accessor<boolean>;
	/** Payload passed to `show(payload)` / `toggle(payload)`. */
	payload: Accessor<P | undefined>;
	/** Open, optionally carrying a payload. */
	show: (payload?: P) => void;
	/** Close and clear the payload. */
	hide: () => void;
	/** Flip open state — opening accepts a payload. */
	toggle: (payload?: P) => void;
}

/**
 * Modal open state with optional payload and lifecycle callbacks.
 *
 * @param options - `{ initialOpen, onShow, onHide }`
 * @returns `{ open, payload, show, hide, toggle }`
 *
 * @example
 * const modal = useModal<{ userId: string }>({ onShow: () => track("open") });
 * <button onClick={() => modal.show({ userId: "42" })}>Edit</button>
 * <Show when={modal.open()}><Modal>{modal.payload()?.userId}</Modal></Show>
 */
export function useModal<P = unknown>(options: UseModalOptions<P> = {}): ModalControls<P> {
	const [open, setOpen] = createSignal(options.initialOpen ?? false);
	const [payload, setPayload] = createSignal<P | undefined>(undefined);
	const show = (p?: P) => {
		setPayload(() => p);
		setOpen(true);
		options.onShow?.(p);
	};
	const hide = () => {
		if (!open()) return;
		setOpen(false);
		setPayload(() => undefined);
		options.onHide?.();
	};
	const toggle = (p?: P) => {
		if (open()) hide();
		else show(p);
	};
	return { open, payload, show, hide, toggle };
}
