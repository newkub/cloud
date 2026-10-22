// ============================================================================
// Presentation - Customer Form Component
// ============================================================================

import {
	Alert,
	Button,
	Form,
	FormField,
	Input,
	Textarea,
} from "@wrikka/solid-ui";
import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { useCustomer } from "#presentation/composables";

interface Props {
	customerId?: string;
	onSuccess?: (customer: unknown) => void;
	onCancel?: () => void;
}

export const CustomerForm: Component<Props> = (props) => {
	const { createCustomer, updateCustomer, isLoading, error, clearError } =
		useCustomer();

	const [email, setEmail] = createSignal("");
	const [name, setName] = createSignal("");
	const [phone, setPhone] = createSignal("");
	const [description, setDescription] = createSignal("");

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		clearError();

		if (props.customerId) {
			await updateCustomer(props.customerId, {
				name: name(),
				phone: phone(),
				description: description(),
			});
		} else {
			const customer = await createCustomer({
				email: email(),
				name: name(),
				phone: phone(),
				description: description(),
			});
			if (customer) {
				props.onSuccess?.(customer);
			}
		}
	};

	return (
		<Form
			onSubmit={handleSubmit}
			class="space-y-4 p-6 bg-white rounded-lg shadow"
		>
			<h2 class="text-xl font-semibold">
				{props.customerId ? "Edit Customer" : "Create Customer"}
			</h2>

			{error() && <Alert variant="destructive">{error()}</Alert>}

			<FormField label="Email *" htmlFor="email">
				<Input
					id="email"
					type="email"
					value={email()}
					onInput={(e) => setEmail(e.currentTarget.value)}
					required
					disabled={isLoading()}
				/>
			</FormField>

			<FormField label="Name" htmlFor="name">
				<Input
					id="name"
					type="text"
					value={name()}
					onInput={(e) => setName(e.currentTarget.value)}
					disabled={isLoading()}
				/>
			</FormField>

			<FormField label="Phone" htmlFor="phone">
				<Input
					id="phone"
					type="tel"
					value={phone()}
					onInput={(e) => setPhone(e.currentTarget.value)}
					disabled={isLoading()}
				/>
			</FormField>

			<FormField label="Description" htmlFor="description">
				<Textarea
					id="description"
					value={description()}
					onInput={(e) => setDescription(e.currentTarget.value)}
					disabled={isLoading()}
					rows={3}
				/>
			</FormField>

			<div class="flex gap-3 justify-end">
				{props.onCancel && (
					<Button
						type="button"
						variant="secondary"
						onClick={props.onCancel}
						disabled={isLoading()}
					>
						Cancel
					</Button>
				)}
				<Button type="submit" disabled={isLoading()}>
					{isLoading() ? "Saving..." : props.customerId ? "Update" : "Create"}
				</Button>
			</div>
		</Form>
	);
};
