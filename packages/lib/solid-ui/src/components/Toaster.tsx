/**
 * Toaster - container that stacks and dismisses toasts.
 */
import { For } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { removeToast, toasts } from "../stores/toast";
import { Toast } from "./Toast";

export interface ToasterProps {
	class?: string;
	variant?: "default" | "primary" | "success" | "warning" | "destructive" | "info";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Toaster(props: ToasterProps) {
	return (
		<div
			class={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-toast flex flex-col gap-2 ${props.radius ? radiusMap[props.radius] : ""} ${props.elevation ? elevationMap[props.elevation] : ""} ${props.class ?? ""}`}
		>
			<For each={toasts()}>
				{(item) => (
					<Toast
						title={item.title}
						description={item.description}
						variant={item.variant ?? props.variant}
						onClose={() => removeToast(item.id)}
					/>
				)}
			</For>
		</div>
	);
}
