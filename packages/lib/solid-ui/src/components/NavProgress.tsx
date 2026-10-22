/**
 * NavProgress — thin scroll-progress bar with a current-section label.
 */
import { createSignal, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";

export interface NavProgressProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Element ids (without `#`) used to derive the current section label. */
	sections?: string[];
	/** Pin the bar to the top of the viewport. @default false */
	fixed?: boolean;
	/** Accessible label for the progress bar. @default "Reading progress" */
	"aria-label"?: string;
}

export function NavProgress(props: NavProgressProps) {
	const [local, rest] = splitProps(props, ["class", "sections", "fixed", "aria-label"]);
	const [percent, setPercent] = createSignal(0);
	const [current, setCurrent] = createSignal("");

	onMount(() => {
		const update = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			setPercent(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
			const ids = local.sections ?? [];
			let label = "";
			for (const id of ids) {
				const el = document.getElementById(id);
				if (el && el.getBoundingClientRect().top <= 1) label = id;
			}
			setCurrent(label || (ids[0] ?? ""));
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		onCleanup(() => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		});
	});

	return (
		<div
			class={`solidui-nav-progress ${(local.fixed ?? false) ? "fixed inset-x-0 top-0 z-fixed" : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div
				role="progressbar"
				aria-label={local["aria-label"] ?? "Reading progress"}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={Math.round(percent())}
				class="h-0.5 w-full bg-muted"
			>
				<div
					class="h-full bg-primary transition-[width] motion-reduce:transition-none"
					style={{ width: `${percent()}%` }}
				/>
			</div>
			<Show when={current()}>
				<div class="bg-background px-3 py-1 text-2xs font-medium uppercase tracking-wide text-muted-foreground">
					{current()}
				</div>
			</Show>
		</div>
	);
}
