import { ctrl } from "./styles";

export interface WeekStepButtonProps {
	dir: 1 | -1;
	label: string;
	disabled?: boolean;
	size?: "sm" | "md" | "lg";
	onClick: () => void;
}

export function WeekStepButton(props: WeekStepButtonProps) {
	return (
		<button
			type="button"
			disabled={props.disabled}
			aria-label={props.label}
			class={`inline-flex items-center justify-center rounded-md border border-border bg-surface px-2 text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${ctrl[props.size ?? "md"]}`}
			onClick={props.onClick}
		>
			<svg
				class="h-3.5 w-3.5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				{props.dir === -1 ? (
					<path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
				) : (
					<path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
				)}
			</svg>
		</button>
	);
}
