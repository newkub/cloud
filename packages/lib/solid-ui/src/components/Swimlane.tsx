/**
 * Swimlane — horizontal lanes with spanning item blocks and an optional step/time header.
 */
import { For, type JSX, Show, splitProps } from "solid-js";

export interface SwimlaneItem {
	/** Item label. */
	label: string;
	/** Columns the item spans. @default 1 */
	span?: number;
	/** Tone name ("primary" | "success" | "warning" | "info" | "destructive") or raw CSS color. */
	color?: string;
}

export interface SwimlaneLane {
	/** Lane name shown in the leading column. */
	label: string;
	/** Blocks placed across the lane. */
	items: SwimlaneItem[];
}

export interface SwimlaneProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Lanes rendered top to bottom. */
	lanes: SwimlaneLane[];
	/** Step/time labels across the top — also fixes the column count. */
	header?: string[];
}

const toneFill: Record<string, string> = {
	primary: "border-primary/30 bg-primary/10 text-primary",
	success: "border-success/30 bg-success/10 text-success",
	warning: "border-warning/30 bg-warning/10 text-warning",
	info: "border-info/30 bg-info/10 text-info",
	destructive: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function Swimlane(props: SwimlaneProps) {
	const [local, rest] = splitProps(props, ["class", "lanes", "header", "aria-label"]);
	const lanes = () => local.lanes ?? [];
	const units = () =>
		local.header?.length ?? Math.max(...lanes().map((l) => l.items.reduce((a, it) => a + (it.span ?? 1), 0)), 1);

	const fillFor = (it: SwimlaneItem) =>
		it.color && toneFill[it.color] ? toneFill[it.color] : it.color ? "" : "border-border bg-muted text-foreground";
	const styleFor = (it: SwimlaneItem) =>
		it.color && !toneFill[it.color]
			? { "border-color": it.color, background: it.color, color: "var(--background, #fff)" }
			: undefined;

	return (
		// biome-ignore lint/a11y/useSemanticElements: generic lane group, not a form fieldset
		<div
			class={`solidui-swimlane overflow-x-auto ${local.class ?? ""}`.trim()}
			role="group"
			aria-label={
				local["aria-label"] ??
				`Swimlane: ${lanes()
					.map((l) => l.label)
					.join(", ")}`
			}
			{...rest}
		>
			<div
				class="grid min-w-0 gap-px rounded-lg border border-border bg-border"
				style={{ "grid-template-columns": `9rem repeat(${units()}, minmax(5rem, 1fr))` }}
			>
				<Show when={local.header}>
					<div class="bg-surface" />
					<For each={local.header}>
						{(h) => <div class="bg-surface px-2 py-1.5 text-center font-medium text-muted-foreground text-xs">{h}</div>}
					</For>
				</Show>
				<For each={lanes()}>
					{(lane) => {
						let cursor = 0;
						return (
							<>
								<div class="flex items-center bg-surface px-3 py-2 font-medium text-foreground text-sm">
									{lane.label}
								</div>
								<For each={lane.items}>
									{(it) => {
										const span = it.span ?? 1;
										const col = 2 + cursor;
										cursor += span;
										return (
											<div
												class={`m-1 flex items-center justify-center rounded border px-2 py-1.5 text-center text-xs ${fillFor(it)}`}
												style={{ "grid-column": `${col} / span ${span}`, ...styleFor(it) }}
											>
												{it.label}
											</div>
										);
									}}
								</For>
								<Show when={units() - cursor > 0}>
									<div class="bg-surface" style={{ "grid-column": `${2 + cursor} / span ${units() - cursor}` }} />
								</Show>
							</>
						);
					}}
				</For>
			</div>
		</div>
	);
}
