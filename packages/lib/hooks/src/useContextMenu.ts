import { type Accessor, createSignal, type JSX } from "solid-js";
import { useEventListener } from "./useEventListener";

export interface ContextMenuPosition {
	/** Viewport-relative left offset in px — clamped so the menu stays on screen */
	x: number;
	/** Viewport-relative top offset in px — clamped so the menu stays on screen */
	y: number;
}

export interface ContextMenuOptions {
	/** Estimated menu width in px — used to clamp `x` inside the viewport. @default 180 */
	menuWidth?: number;
	/** Estimated menu height in px — used to clamp `y` inside the viewport. @default 160 */
	menuHeight?: number;
	/** Viewport padding in px kept around the clamped menu. @default 4 */
	padding?: number;
}

export interface ContextMenuControls {
	/** True while the menu is open */
	open: Accessor<boolean>;
	/** Clamped viewport position of the menu */
	position: Accessor<ContextMenuPosition>;
	/** Open at a contextmenu/pointer event — calls `preventDefault` */
	openAt: (e: { clientX: number; clientY: number; preventDefault?: () => void }) => void;
	/** Close the menu */
	close: () => void;
	/** Props for the menu element — fixed positioning at `position()` plus a contextmenu stopper */
	menuProps: () => {
		role: "menu";
		style: JSX.CSSProperties;
		onContextMenu: (e: MouseEvent) => void;
	};
}

/**
 * Context-menu state — `openAt(event)` prevents the native menu, clamps the
 * position inside the viewport using `menuWidth`/`menuHeight` estimates, and
 * `menuProps()` hands the menu element fixed positioning + a contextmenu
 * stopper. Closes on window click, scroll, blur, or Escape.
 *
 * @param options — `menuWidth`/`menuHeight` clamp estimates, `padding`
 * @returns `{ open, position, openAt, close, menuProps }`
 *
 * @example
 * const menu = useContextMenu({ menuWidth: 160 });
 * <div onContextMenu={menu.openAt}>right-click me</div>
 * <Show when={menu.open()}>
 *   <div {...menu.menuProps()}><button onClick={menu.close}>Rename</button></div>
 * </Show>
 */
export function useContextMenu(options?: ContextMenuOptions): ContextMenuControls {
	const menuWidth = options?.menuWidth ?? 180;
	const menuHeight = options?.menuHeight ?? 160;
	const padding = options?.padding ?? 4;
	const [open, setOpen] = createSignal(false);
	const [position, setPosition] = createSignal<ContextMenuPosition>({ x: 0, y: 0 });

	const openAt: ContextMenuControls["openAt"] = (e) => {
		e.preventDefault?.();
		let x = e.clientX;
		let y = e.clientY;
		if (typeof window !== "undefined") {
			x = Math.min(x, Math.max(padding, window.innerWidth - menuWidth - padding));
			y = Math.min(y, Math.max(padding, window.innerHeight - menuHeight - padding));
		}
		setPosition({ x: Math.max(padding, x), y: Math.max(padding, y) });
		setOpen(true);
	};

	const close = () => setOpen(false);

	useEventListener(() => (typeof window === "undefined" ? undefined : window), "click", close, {
		enabled: open,
	});
	useEventListener(() => (typeof window === "undefined" ? undefined : window), "blur", close, {
		enabled: open,
	});
	useEventListener(() => (typeof window === "undefined" ? undefined : window), "scroll", close, {
		enabled: open,
		capture: true,
		passive: true,
	});
	useEventListener(
		() => (typeof window === "undefined" ? undefined : window),
		"keydown",
		(e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		},
		{ enabled: open },
	);

	return {
		open,
		position,
		openAt,
		close,
		menuProps: () => ({
			role: "menu",
			style: {
				position: "fixed",
				left: `${position().x}px`,
				top: `${position().y}px`,
				"z-index": 60,
			},
			onContextMenu: (e: MouseEvent) => e.preventDefault(),
		}),
	};
}
