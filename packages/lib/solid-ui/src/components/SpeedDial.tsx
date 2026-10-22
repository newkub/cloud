/**
 * SpeedDial — FAB that fans out labelled secondary actions.
 * @deprecated Use `FloatButton` with `actions` — same fan-out plus placement
 * and radius/elevation options.
 */
import { type JSX, splitProps } from "solid-js";
import { FloatButton } from "./FloatButton";

export interface SpeedDialAction {
	label: string;
	icon: JSX.Element;
	onClick?: () => void;
}

export interface SpeedDialProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	/** Secondary actions fanned out above the FAB. */
	actions?: SpeedDialAction[];
	/** FAB icon — shown when closed. @default "+" */
	icon?: JSX.Element;
	/** Accessible label for the FAB. @default "Quick actions" */
	"aria-label"?: string;
}

export function SpeedDial(props: SpeedDialProps) {
	const [local, rest] = splitProps(props, ["actions", "icon", "aria-label"]);
	return (
		<FloatButton
			label={local["aria-label"] ?? "Quick actions"}
			actions={(local.actions ?? []).map((a) => ({ id: a.label, label: a.label, icon: a.icon, onSelect: a.onClick }))}
			{...rest}
		>
			{local.icon ?? "+"}
		</FloatButton>
	);
}
