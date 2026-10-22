/**
 * UseCaseDiagram — UML use case: actors outside a system boundary, ellipse cases inside.
 */
import { For, type JSX, mergeProps, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface UseCaseDiagramProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** System boundary label. */
	system?: string;
	actors?: string[];
	cases?: string[];
	width?: number;
	height?: number;
	radius?: Radius;
	elevation?: Elevation;
}

export function UseCaseDiagram(props: UseCaseDiagramProps) {
	const merged = mergeProps({ system: "System", width: 400, height: 220 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"children",
		"system",
		"actors",
		"cases",
		"width",
		"height",
		"radius",
		"elevation",
	]);

	const view = () => {
		const actors = local.actors ?? [];
		const cases = local.cases ?? [];
		const boundX = 90;
		const boundW = local.width - boundX - 16;
		const actorX = 34;
		const actorY = (i: number) => 40 + (i * (local.height - 70)) / Math.max(1, actors.length - 1 || 1);
		const caseY = (i: number) => 44 + (i * (local.height - 80)) / Math.max(1, cases.length - 1 || 1);
		const cx = boundX + boundW / 2;
		return { boundX, boundW, actorX, actorY, caseY, cx };
	};

	return (
		<div
			class={[
				"w-full",
				local.radius ? radiusMap[local.radius] : "",
				local.elevation ? elevationMap[local.elevation] : "",
				local.class ?? "",
			]
				.filter(Boolean)
				.join(" ")}
			{...rest}
		>
			<svg class="w-full" viewBox={`0 0 ${local.width} ${local.height}`} role="img" aria-label="Use case diagram">
				<rect
					x={view().boundX}
					y={16}
					width={view().boundW}
					height={local.height - 32}
					rx="8"
					fill="none"
					stroke="currentColor"
					class="text-border"
				/>
				<text x={view().boundX + 8} y={30} font-size="9" class="fill-muted-foreground font-semibold">
					{local.system}
				</text>
				<For each={local.actors ?? []}>
					{(a, i) => {
						const y = view().actorY(i());
						const x = view().actorX;
						return (
							<g stroke="currentColor" class="text-foreground" fill="none">
								<circle cx={x} cy={y - 10} r="5" />
								<line x1={x} y1={y - 5} x2={x} y2={y + 8} />
								<line x1={x - 7} y1={y} x2={x + 7} y2={y} />
								<line x1={x} y1={y + 8} x2={x - 6} y2={y + 18} />
								<line x1={x} y1={y + 8} x2={x + 6} y2={y + 18} />
								<text x={x} y={y + 30} text-anchor="middle" font-size="8" stroke="none" class="fill-muted-foreground">
									{a}
								</text>
								<For each={local.cases ?? []}>
									{(_, ci) => (
										<line
											x1={x + 10}
											y1={y}
											x2={view().cx - 48}
											y2={view().caseY(ci())}
											stroke-dasharray="3 3"
											class="text-border"
										/>
									)}
								</For>
							</g>
						);
					}}
				</For>
				<For each={local.cases ?? []}>
					{(c, i) => (
						<g>
							<ellipse
								cx={view().cx}
								cy={view().caseY(i())}
								rx="48"
								ry="14"
								fill="var(--color-surface)"
								stroke="currentColor"
								class="text-primary"
							/>
							<text x={view().cx} y={view().caseY(i()) + 3} text-anchor="middle" font-size="8" class="fill-foreground">
								{c}
							</text>
						</g>
					)}
				</For>
			</svg>
			{local.children}
		</div>
	);
}
