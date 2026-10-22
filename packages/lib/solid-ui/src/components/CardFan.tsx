/**
 * CardFan — children stacked in place that fan out via CSS vars on hover/focus.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { children, For, type JSX, splitProps } from "solid-js";

export interface CardFanProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Degrees between adjacent cards when fanned. @default 12 */
	angle?: number;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function CardFan(props: CardFanProps) {
	const [local, pass] = splitProps(props, ["angle", "children"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "group grid",
		unstyled: props.unstyled,
	});
	const items = children(() => local.children);
	const list = () => items.toArray();

	return (
		<div class={className()} {...rest}>
			<For each={list()}>
				{(kid, i) => {
					const mid = (list().length - 1) / 2;
					const offset = i() - mid;
					return (
						<div
							class="solidui-card-fan-item col-start-1 row-start-1 origin-bottom transition-transform duration-300 ease-out motion-reduce:transition-none group-focus-within:[transform:rotate(var(--cf-r))_translateY(var(--cf-y))] group-hover:[transform:rotate(var(--cf-r))_translateY(var(--cf-y))]"
							style={{
								"--cf-r": `${offset * (local.angle ?? 12)}deg`,
								"--cf-y": `${Math.abs(offset) * -4}px`,
								"z-index": `${i() + 1}`,
							}}
						>
							{kid}
						</div>
					);
				}}
			</For>
		</div>
	);
}
