import type { JSX } from "solid-js";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";

export interface EmptyStateBlockProps extends JSX.HTMLAttributes<HTMLDivElement> {
	title: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
	icon?: JSX.Element;
}

/** Composed empty state — icon, message and optional CTA. */
export function EmptyStateBlock(props: EmptyStateBlockProps) {
	return (
		<div class={props.class}>
			<Card class="mx-auto max-w-md text-center">
				<CardContent class="flex flex-col items-center gap-3 py-10">
					{props.icon && <div class="text-muted-foreground">{props.icon}</div>}
					<h3 class="text-base font-semibold">{props.title}</h3>
					{props.description && <p class="text-sm text-muted-foreground">{props.description}</p>}
					{props.actionLabel && (
						<Button variant="primary" class="mt-2" onClick={() => props.onAction?.()}>
							{props.actionLabel}
						</Button>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
