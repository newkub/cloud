// ============================================================================
// Presentation - Customer List Component
// ============================================================================

import { Alert, Button, Card, Loading } from "@wrikka/solid-ui";
import { type Component, For, onMount } from "solid-js";
import type { Customer } from "#modules/customer";
import { useCustomer } from "#presentation/composables";

interface Props {
	onSelectCustomer?: (customer: Customer) => void;
	onEditCustomer?: (customer: Customer) => void;
	onDeleteCustomer?: (customerId: string) => void;
}

export const CustomerList: Component<Props> = (props) => {
	const {
		customers,
		fetchCustomers,
		isLoading,
		error,
		deleteCustomer,
		selectCustomer,
		clearError,
	} = useCustomer();

	onMount(() => {
		fetchCustomers();
	});

	const handleDelete = async (customerId: string) => {
		if (confirm("Are you sure you want to delete this customer?")) {
			await deleteCustomer(customerId);
			props.onDeleteCustomer?.(customerId);
		}
	};

	const handleSelect = (customer: Customer) => {
		selectCustomer(customer);
		props.onSelectCustomer?.(customer);
	};

	return (
		<div class="space-y-4">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-semibold">Customers</h2>
				{error() && (
					<Button
						type="button"
						variant="link"
						onClick={clearError}
						class="text-sm text-red-600 hover:underline"
					>
						Dismiss Error
					</Button>
				)}
			</div>

			{error() && <Alert variant="destructive">{error()}</Alert>}

			{isLoading() ? (
				<Loading message="Loading customers..." class="justify-center py-8" />
			) : customers().length === 0 ? (
				<div class="text-center py-8 text-gray-500">No customers found</div>
			) : (
				<div class="grid gap-4">
					<For each={customers()}>
						{(customer) => (
							<Card
								onClick={() => handleSelect(customer)}
								class="p-4 hover:shadow-md transition-shadow cursor-pointer text-left w-full"
							>
								<div class="flex justify-between items-start">
									<div class="flex-1">
										<h3 class="font-medium text-gray-900">
											{customer.name || customer.email}
										</h3>
										<p class="text-sm text-gray-600">{customer.email}</p>
										{customer.phone && (
											<p class="text-sm text-gray-500">{customer.phone}</p>
										)}
										{customer.description && (
											<p class="text-sm text-gray-500 mt-1">
												{customer.description}
											</p>
										)}
									</div>
									<div class="flex gap-2 ml-4">
										<Button
											type="button"
											variant="ghost"
											onClick={(e) => {
												e.stopPropagation();
												props.onEditCustomer?.(customer);
											}}
											class="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
										>
											Edit
										</Button>
										<Button
											type="button"
											variant="ghost"
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(customer.id);
											}}
											class="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
										>
											Delete
										</Button>
									</div>
								</div>
							</Card>
						)}
					</For>
				</div>
			)}
		</div>
	);
};
