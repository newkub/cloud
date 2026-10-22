/**
 * DocRating - 1-5 star rating control for docs feedback, with a readonly display mode.
 */

import { createSignal, For, type JSX, splitProps } from "solid-js";

export interface DocRatingProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onRate"> {
	/** Controlled rating 1-5. Omit for uncontrolled usage. */
	value?: number;
	/** Called with the chosen rating (1-5). */
	onRate?: (value: number) => void;
	/** Display-only mode — no interaction. @default false */
	readonly?: boolean;
	/** Accessible group label. @default "Rate this page" */
	label?: string;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const StarIcon = (props: { filled: boolean }) => (
	<svg
		viewBox="0 0 24 24"
		class="h-5 w-5"
		aria-hidden="true"
		fill={props.filled ? "currentColor" : "none"}
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
	>
		<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
	</svg>
);

let groupId = 0;

export function DocRating(props: DocRatingProps) {
	const [local, rest] = splitProps(props, ["class", "value", "onRate", "readonly", "label", "unstyled"]);
	const [internal, setInternal] = createSignal(0);
	const [hover, setHover] = createSignal(0);
	const current = () => local.value ?? internal();
	const shown = () => hover() || current();
	const name = `solidui-doc-rating-${++groupId}`;

	const rate = (n: number) => {
		if (local.readonly) return;
		setInternal(n);
		local.onRate?.(n);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (local.readonly) return;
		if (e.key === "ArrowRight" || e.key === "ArrowUp") {
			e.preventDefault();
			rate(Math.min(5, current() + 1));
		} else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
			e.preventDefault();
			rate(Math.max(1, current() - 1));
		}
	};

	const className = () =>
		local.unstyled
			? (local.class ?? "")
			: `solidui-doc-rating inline-flex items-center gap-0.5 ${local.class ?? ""}`.trim();

	return (
		<div
			role="radiogroup"
			aria-label={local.label ?? "Rate this page"}
			aria-readonly={local.readonly || undefined}
			class={className()}
			onKeyDown={onKeyDown}
			onMouseLeave={() => setHover(0)}
			{...rest}
		>
			<For each={[1, 2, 3, 4, 5]}>
				{(n) => (
					<label
						class={`inline-flex ${local.readonly ? "cursor-default" : "cursor-pointer"} ${
							local.unstyled ? "" : n <= shown() ? "text-warning" : "text-muted-foreground/40"
						}`}
						onMouseEnter={() => !local.readonly && setHover(n)}
					>
						<input
							type="radio"
							name={name}
							class="sr-only"
							checked={current() === n}
							disabled={local.readonly}
							onChange={() => rate(n)}
						/>
						<StarIcon filled={n <= shown()} />
						<span class="sr-only">{`${n} star${n === 1 ? "" : "s"}`}</span>
					</label>
				)}
			</For>
			<span class="sr-only" aria-live="polite">
				{current() > 0 ? `Rated ${current()} out of 5` : "Not rated"}
			</span>
		</div>
	);
}
