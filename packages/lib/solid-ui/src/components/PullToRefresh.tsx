/**
 * PullToRefresh - overscroll container that fires onRefresh when pulled past the threshold.
 */
import { createSignal, type JSX, splitProps } from "solid-js";
import { Spinner } from "./Spinner";

export interface PullToRefreshProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Called when the pull threshold is released. Should return a promise. */
	onRefresh?: () => void | Promise<void>;
	/** Pull distance in px that triggers refresh. @default 64 */
	threshold?: number;
}

export function PullToRefresh(props: PullToRefreshProps) {
	const [local, rest] = splitProps(props, ["class", "onRefresh", "threshold", "children"]);
	const [pull, setPull] = createSignal(0);
	const [refreshing, setRefreshing] = createSignal(false);
	let el: HTMLDivElement | undefined;
	let startY = 0;

	const onTouchStart = (e: TouchEvent) => {
		if (el && el.scrollTop <= 0) startY = e.touches[0].clientY;
		else startY = 0;
	};
	const onTouchMove = (e: TouchEvent) => {
		if (!startY || refreshing()) return;
		const dy = e.touches[0].clientY - startY;
		if (dy > 0 && el && el.scrollTop <= 0) setPull(Math.min(dy, (local.threshold ?? 64) * 1.6));
	};
	const onTouchEnd = async () => {
		if (pull() >= (local.threshold ?? 64) && local.onRefresh) {
			setRefreshing(true);
			await local.onRefresh();
			setRefreshing(false);
		}
		setPull(0);
		startY = 0;
	};

	const indicator = () => Math.min(1, pull() / (local.threshold ?? 64));

	return (
		<div
			ref={el}
			class={`solidui-pull-to-refresh overflow-y-auto ${local.class ?? ""}`}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
			{...rest}
		>
			<div
				class="flex items-center justify-center transition-[height] motion-reduce:transition-none overflow-hidden"
				style={{
					height:
						refreshing() || pull() > 0 ? `${Math.max(pull(), refreshing() ? (local.threshold ?? 64) : 0)}px` : "0px",
				}}
			>
				{refreshing() ? (
					<Spinner />
				) : (
					<span
						class="text-muted-foreground transition-transform"
						style={{ transform: `rotate(${indicator() * 180}deg)`, opacity: indicator() }}
						aria-hidden="true"
					>
						↓
					</span>
				)}
			</div>
			{local.children}
		</div>
	);
}
