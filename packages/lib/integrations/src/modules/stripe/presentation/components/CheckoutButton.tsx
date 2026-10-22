import { Button } from "@wrikka/solid-ui";
import { type Component, createMemo, type JSX } from "solid-js";

// Type declarations for Solid composables
declare function useCheckout(): {
	createSession: (
		options: CheckoutSessionOptions,
	) => Promise<{ sessionId: string }>;
	redirectToCheckout: (sessionId: string) => Promise<void>;
	isLoading: () => boolean;
	error: () => unknown;
};

interface CheckoutSessionOptions {
	lineItems: readonly { price: string; quantity: number }[];
	mode?: "payment" | "subscription" | "setup";
	customerId?: string;
	customerEmail?: string;
	metadata?: Record<string, string>;
	successUrl?: string;
	cancelUrl?: string;
	allowPromotionCodes?: boolean;
}

interface Props {
	allowPromotionCodes?: boolean;
	buttonText?: string;
	cancelUrl?: string;
	customerEmail?: string;
	customerId?: string;
	lineItems: CheckoutSessionOptions["lineItems"];
	loadingText?: string;
	metadata?: Record<string, string>;
	mode?: "payment" | "subscription" | "setup";
	size?: "sm" | "md" | "lg";
	successUrl?: string;
	variant?: "primary" | "secondary" | "outline";
	onSuccess?: (sessionId: string) => void;
	onError?: (error: Error) => void;
	onLoading?: (isLoading: boolean) => void;
	children?: JSX.Element;
}

const CheckoutButton: Component<Props> = (props) => {
	const { createSession, redirectToCheckout, isLoading } = useCheckout();

	const _handleCheckout = async () => {
		try {
			props.onLoading?.(true);
			const { sessionId } = await createSession({
				lineItems: props.lineItems,
				mode: props.mode,
				customerId: props.customerId,
				customerEmail: props.customerEmail,
				metadata: props.metadata,
				successUrl: props.successUrl,
				cancelUrl: props.cancelUrl,
				allowPromotionCodes: props.allowPromotionCodes,
			});

			await redirectToCheckout(sessionId);
			props.onSuccess?.(sessionId);
		} catch (err) {
			props.onError?.(err as Error);
		} finally {
			props.onLoading?.(false);
		}
	};

	const _variantClasses = createMemo(() => {
		const variants = {
			primary: "bg-blue-600 hover:bg-blue-700 text-white",
			secondary: "bg-gray-600 hover:bg-gray-700 text-white",
			outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
		};
		return variants[props.variant || "primary"];
	});

	const _sizeClasses = createMemo(() => {
		const sizes = {
			sm: "px-4 py-2 text-sm",
			md: "px-6 py-3 text-base",
			lg: "px-8 py-4 text-lg",
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
			onClick={_handleCheckout}
		>
			{props.children ? (
				props.children
			) : isLoading() ? (
				<span>{props.loadingText || "Processing..."}</span>
			) : (
				<span>{props.buttonText || "Checkout with Stripe"}</span>
			)}
		</Button>
	);
};

export default CheckoutButton;
