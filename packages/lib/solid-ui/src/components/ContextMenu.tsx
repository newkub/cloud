/**
 * Right-click context menu
 */

import { ContextMenuContent } from "./context-menu/ContextMenuContent";
import type { ContextMenuProps } from "./context-menu/types";
import { useContextMenu } from "./context-menu/use-context-menu";

export type { ContextMenuItem, ContextMenuProps } from "./context-menu/types";

export function ContextMenu(props: ContextMenuProps) {
	const { local, rest, open, pos, setAreaRef, setContentRef, onContextMenu, onTriggerKeyDown, onItemClick, className } =
		useContextMenu(props);

	return (
		<>
			<button
				type="button"
				class={className()}
				ref={setAreaRef}
				disabled={local.disabled}
				onContextMenu={onContextMenu}
				onKeyDown={onTriggerKeyDown}
				aria-haspopup="menu"
				aria-expanded={open()}
				data-state={open() ? "open" : "closed"}
				{...rest}
			>
				{local.children}
			</button>
			<ContextMenuContent
				open={open()}
				pos={pos()}
				setContentRef={setContentRef}
				items={local.items}
				variant={local.variant}
				radius={local.radius}
				elevation={local.elevation}
				onItemClick={onItemClick}
			/>
		</>
	);
}
