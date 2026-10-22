/**
 * ReviewForm - star rating + comment form for product/content reviews.
 */
import { createSignal, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";
import { Button } from "./Button";
import { Rating } from "./Rating";
import { Textarea } from "./Textarea";

export interface ReviewFormProps extends Omit<JSX.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
	/** Called with rating (1-5) and comment text. */
	onSubmit?: (review: { rating: number; comment: string }) => void;
	/** Submit label. @default "Submit review" */
	submitLabel?: string;
	/** Textarea placeholder. @default "Share your experience…" */
	placeholder?: string;
	/** Corner radius. */
	radius?: Radius;
}

export function ReviewForm(props: ReviewFormProps) {
	const [local, rest] = splitProps(props, ["class", "onSubmit", "submitLabel", "placeholder", "radius"]);
	const [rating, setRating] = createSignal(0);
	const [comment, setComment] = createSignal("");

	const submit = (e: SubmitEvent) => {
		e.preventDefault();
		if (rating() === 0) return;
		local.onSubmit?.({ rating: rating(), comment: comment().trim() });
		setRating(0);
		setComment("");
	};

	const className = () =>
		[
			"solidui-review-form border border-border bg-card p-4 space-y-3",
			radiusMap[local.radius ?? "md"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<form class={className()} onSubmit={submit} {...rest}>
			<p class="text-sm font-medium text-foreground">Rate your experience</p>
			<Rating value={rating()} onValueChange={setRating} />
			<Textarea
				placeholder={local.placeholder ?? "Share your experience…"}
				value={comment()}
				rows={3}
				onInput={(e) => setComment(e.currentTarget.value)}
			/>
			<div class="flex justify-end">
				<Button type="submit" variant="primary" disabled={rating() === 0}>
					{local.submitLabel ?? "Submit review"}
				</Button>
			</div>
		</form>
	);
}
