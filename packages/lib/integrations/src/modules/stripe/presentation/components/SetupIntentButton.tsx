import { Button } from "@wrikka/solid-ui";
import type { Component, JSX } from "solid-js";

// Type declarations for Solid composables
declare function useSetupIntent(): {
	createSetupIntent: (
		options: unknown,
	) => Promise<{ clientSecret: string; setupIntentId: string }>;
	confirmSetup: (
		clientSecret: string,
		paymentMethodId: string,
	) => Promise<{ setupIntentId: string; status: string }>;
	isLoading: () => boolean;
	error: () => unknown;
};

interface Props {
	customerId?: string;
	paymentMethodTypes?: string[];
	usage?: "off_session" | "on_session";
	metadata?: Record<string, string>;
	onSuccess?: (setupIntentId: string) => void;
	onError?: (error: Error) => void;
	children?: JSX.Element;
}

const SetupIntentButton: Component<Props> = (props) => {
	const { createSetupIntent, isLoading } = useSetupIntent();

	const _handleSetup = async () => {
		try {
			const { setupIntentId } = await createSetupIntent({
				customerId: props.customerId,
				paymentMethodTypes: props.paymentMethodTypes,
				usage: props.usage,
				metadata: props.metadata,
			});

			props.onSuccess?.(setupIntentId);
		} catch (err) {
			props.onError?.(err instanceof Error ? err : new Error("Setup failed"));
		}
	};

	return (
		<Button
			type="button"
			disabled={isLoading()}
			onClick={_handleSetup}
			class="px-6 py-3 bg-[#635bff] text-white border-none rounded cursor-pointer text-base font-medium transition-colors duration-200 hover:bg-[#4b45c7] disabled:opacity-60 disabled:cursor-not-allowed"
		>
			{isLoading() ? (
				<span>Loading...</span>
			) : (
				<span>{props.children || "Save Payment Method"}</span>
			)}
		</Button>
	);
};

export default SetupIntentButton;
