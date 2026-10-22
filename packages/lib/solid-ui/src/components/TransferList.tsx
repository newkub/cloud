/**
 * TransferList — dual list box for moving items between "available" and "selected".
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";
import { MoveButton } from "./transfer-list/MoveButton";
import { TransferPanel } from "./transfer-list/TransferPanel";
import { resolveLabels, type TransferItem, type TransferListLabels } from "./transfer-list/types";

export type { TransferItem, TransferListLabels } from "./transfer-list/types";

export interface TransferListProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	available: TransferItem[];
	selected: TransferItem[];
	onChange?: (available: TransferItem[], selected: TransferItem[]) => void;
	/** Panel titles (kept for backwards compatibility — merged into `labels`). */
	titles?: { available?: string; selected?: string };
	/** All UI text overrides — panel titles, filter placeholder, empty states, control labels. */
	labels?: TransferListLabels;
	/** Filter box above each list. @default true */
	searchable?: boolean;
	/** Select-all checkbox in each panel header. @default true */
	selectAll?: boolean;
	/** "Move all" buttons alongside the move buttons. @default true */
	showMoveAll?: boolean;
	/** Per-panel item cap before scroll. */
	maxHeight?: string;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	disabled?: boolean;
}

export function TransferList(props: TransferListProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"available",
		"selected",
		"onChange",
		"titles",
		"labels",
		"searchable",
		"selectAll",
		"showMoveAll",
		"maxHeight",
		"size",
		"variant",
		"radius",
		"elevation",
		"disabled",
	]);
	const [checkedL, setCheckedL] = createSignal(new Set<string>());
	const [checkedR, setCheckedR] = createSignal(new Set<string>());
	const [qL, setQL] = createSignal("");
	const [qR, setQR] = createSignal("");

	const labels = () => resolveLabels(local.titles, local.labels);
	const available = () => local.available ?? [];
	const selected = () => local.selected ?? [];

	const move = (dir: 1 | -1, ids?: Set<string>) => {
		const src = dir === 1 ? available() : selected();
		const dst = dir === 1 ? selected() : available();
		const picked = ids ?? (dir === 1 ? checkedL() : checkedR());
		const moving = src.filter((i) => picked.has(i.id) && !i.disabled);
		const staying = src.filter((i) => !(picked.has(i.id) && !i.disabled));
		const [nextA, nextS] = dir === 1 ? [staying, [...dst, ...moving]] : [[...dst, ...moving], staying];
		local.onChange?.(nextA, nextS);
		if (dir === 1) setCheckedL(new Set<string>());
		else setCheckedR(new Set<string>());
	};
	const moveAll = (dir: 1 | -1) => {
		const src = dir === 1 ? available() : selected();
		move(dir, new Set(src.map((i) => i.id)));
	};

	return (
		<div
			class={`solidui-transfer-list flex items-stretch gap-2 ${surfaceVariants[local.variant ?? "default"]} p-3 ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<TransferPanel
				items={() => local.available}
				query={qL}
				onQuery={setQL}
				checked={checkedL}
				setChecked={setCheckedL}
				title={labels().available}
				emptyText={labels().emptyAvailable}
				selectAllLabel={labels().selectAll}
				filterPlaceholder={labels().filterPlaceholder}
				searchable={local.searchable ?? true}
				selectAll={local.selectAll ?? true}
				maxHeight={local.maxHeight}
				size={local.size ?? "md"}
				radius={local.radius ?? "md"}
				disabled={local.disabled}
			/>
			<div class="flex flex-col items-center justify-center gap-2">
				<Show when={local.showMoveAll ?? true}>
					<MoveButton
						dir={1}
						all
						disabled={local.disabled || available().length === 0}
						label={labels().moveAllRight}
						onClick={() => moveAll(1)}
					/>
				</Show>
				<MoveButton
					dir={1}
					disabled={local.disabled || checkedL().size === 0}
					label={labels().moveRight}
					onClick={() => move(1)}
				/>
				<MoveButton
					dir={-1}
					disabled={local.disabled || checkedR().size === 0}
					label={labels().moveLeft}
					onClick={() => move(-1)}
				/>
				<Show when={local.showMoveAll ?? true}>
					<MoveButton
						dir={-1}
						all
						disabled={local.disabled || selected().length === 0}
						label={labels().moveAllLeft}
						onClick={() => moveAll(-1)}
					/>
				</Show>
			</div>
			<TransferPanel
				items={() => local.selected}
				query={qR}
				onQuery={setQR}
				checked={checkedR}
				setChecked={setCheckedR}
				title={labels().selected}
				emptyText={labels().emptySelected}
				selectAllLabel={labels().selectAll}
				filterPlaceholder={labels().filterPlaceholder}
				searchable={local.searchable ?? true}
				selectAll={local.selectAll ?? true}
				maxHeight={local.maxHeight}
				size={local.size ?? "md"}
				radius={local.radius ?? "md"}
				disabled={local.disabled}
			/>
		</div>
	);
}
