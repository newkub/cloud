/**
 * TransferList move button — chevron icon pointing left/right,
 * doubled when `all` ("move all") is set.
 */

export interface MoveButtonProps {
	/** 1 moves right, -1 moves left. */
	dir: 1 | -1;
	/** Double-chevron "move all" variant. */
	all?: boolean;
	disabled?: boolean;
	/** Accessible label + tooltip. */
	label: string;
	onClick: () => void;
}

export function MoveButton(props: MoveButtonProps) {
	return (
		<button
			type="button"
			disabled={props.disabled}
			aria-label={props.label}
			title={props.label}
			class="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground motion-safe:transition-colors motion-reduce:transition-none hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-40"
			onClick={() => props.onClick()}
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				{props.all ? (
					props.dir === 1 ? (
						<path d="m5 6 6 6-6 6M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
					) : (
						<path d="m19 18-6-6 6-6M11 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
					)
				) : props.dir === 1 ? (
					<path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
				) : (
					<path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
				)}
			</svg>
		</button>
	);
}
