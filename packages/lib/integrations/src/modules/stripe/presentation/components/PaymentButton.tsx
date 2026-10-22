import { Button } from "@wrikka/solid-ui";
import { type Component, createMemo, createSignal, type JSX } from "solid-js";

// Type declarations for Solid composables
declare function usePaymentIntent(): {
	createIntent: (
		options: unknown,
	) => Promise<{ clientSecret: string; paymentIntentId: string }>;
	confirmPayment: (
		clientSecret: string,
		paymentMethodId: string,
	) => Promise<{ status: string; error?: unknown }>;
	isLoading: () => boolean;
	error: () => unknown;
};

interface Props {
	amount: number;
	buttonText?: string;
	currency?: string;
	customerId?: string;
	metadata?: Record<string, string>;
	processingText?: string;
	setupFutureUsage?: "on_session" | "off_session";
	size?: "sm" | "md" | "lg";
	variant?: "primary" | "secondary" | "outline" | "ghost";
	onSuccess?: (result: { paymentIntentId: string; status: string }) => void;
	onError?: (error: Error) => void;
	onLoading?: (isLoading: boolean) => void;
	children?: JSX.Element;
}

const PaymentButton: Component<Props> = (props) => {
	const { createIntent, confirmPayment, isLoading } = usePaymentIntent();
	const [paymentMethodId, _setPaymentMethod] = createSignal<string | null>(
		null,
	);

	const _handlePayment = async () => {
		try {
			props.onLoading?.(true);
			const { clientSecret, paymentIntentId } = await createIntent({
				amount: props.amount,
				currency: props.currency,
				customerId: props.customerId,
				metadata: props.metadata,
				setupFutureUsage: props.setupFutureUsage,
			});

			const currentPaymentMethodId = paymentMethodId();
			if (currentPaymentMethodId) {
				const result = await confirmPayment(
					clientSecret,
					currentPaymentMethodId,
				);
				if (result.status === "succeeded") {
					props.onSuccess?.({ paymentIntentId, status: result.status });
				}
			}
		} catch (err) {
			props.onError?.(err as Error);
		} finally {
			props.onLoading?.(false);
		}
	};

	const _variantClasses = createMemo(() => {
		const variants = {
			primary: "bg-blue-600 text-white hover:bg-blue-700",
			secondary: "bg-gray-600 text-white hover:bg-gray-700",
			outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
			ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
		};
		return variants[props.variant || "primary"];
	});

	const _sizeClasses = createMemo(() => {
		const sizes = {
			sm: "px-3 py-1.5 text-sm",
			md: "px-4 py-2 text-base",
			lg: "px-6 py-3 text-lg",
		};
		return sizes[props.size || "md"];
	});

	return (
		<Button
			type="button"
			disabled={isLoading()}
			class={[
				"rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
				_variantClasses(),
				_sizeClasses(),
			].join(" ")}
			onClick={_handlePayment}
		>
			{props.children ? (
				props.children
			) : isLoading() ? (
				<span>{props.processingText || "Processing..."}</span>
			) : (
				<span>{props.buttonText || "Pay Now"}</span>
			)}
		</Button>
	);
};

export default PaymentButton;
