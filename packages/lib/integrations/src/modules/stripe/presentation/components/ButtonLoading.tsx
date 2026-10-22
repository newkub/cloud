import { Button, Spinner } from "@wrikka/solid-ui";
import type { Component, JSX } from "solid-js";

interface Props {
	disabled?: boolean;
	loading?: boolean;
	loadingText?: string;
	size?: "sm" | "md" | "lg";
	children?: JSX.Element;
}

const ButtonLoading: Component<Props> = (props) => {
	const size = () => props.size || "md";
	const disabled = () => props.disabled || props.loading;
	const loading = () => props.loading || false;
	const loadingText = () => props.loadingText || "Processing...";

	const sizeClasses = () => {
		const sizes = {
			sm: "px-3 py-1.5 text-sm",
			md: "px-4 py-2 text-base",
			lg: "px-6 py-3 text-lg",
		};
		return sizes[size()];
	};

	const spinnerSize = () => {
		const sizes = {
			sm: "w-3 h-3",
			md: "w-4 h-4",
			lg: "w-5 h-5",
		};
		return sizes[size()];
	};

	return (
		<Button
			type="button"
			disabled={disabled()}
			class="relative inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			classList={{
				[sizeClasses()]: true,
				"opacity-50 cursor-not-allowed": disabled(),
			}}
		>
			{loading() && (
				<Spinner
					class={`border-current border-t-transparent ${spinnerSize()}`}
				/>
			)}
			{!loading() ? props.children : <span>{loadingText()}</span>}
		</Button>
	);
};

export default ButtonLoading;
