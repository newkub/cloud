import { type Elevation, elevationMap, type Radius, radiusMap } from "../../lib/variants";
export interface PaginationEllipsisProps {
	class?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function PaginationEllipsis(props: PaginationEllipsisProps) {
	return (
		<li
			class={`flex h-8 items-center justify-center px-1 text-sm text-muted-foreground ${props.radius ? radiusMap[props.radius] : ""} ${props.elevation ? elevationMap[props.elevation] : ""} ${props.class ?? ""}`}
			aria-hidden="true"
		>
			…
		</li>
	);
}
