// ============================================================================
// Presentation - Customer Composable
// ============================================================================

import type { Accessor, Setter } from "solid-js";
import { createMemo, createSignal } from "solid-js";
import { customerAdapter } from "#adapters/customer-adapter";
import type { Customer, CustomerFilters } from "#modules/customer/types";

export type UseCustomerReturn = {
	customers: Accessor<readonly Customer[]>;
	selectedCustomer: Accessor<Customer | null>;
	isLoading: Accessor<boolean>;
	error: Accessor<string | null>;
	filters: Accessor<CustomerFilters>;
	hasCustomers: Accessor<boolean>;
	customerCount: Accessor<number>;
	hasError: Accessor<boolean>;
	fetchCustomers: (newFilters?: CustomerFilters) => Promise<void>;
	fetchCustomer: (customerId: string) => Promise<void>;
	createCustomer: (data: {
		email: string;
		name?: string;
		phone?: string;
		description?: string;
		metadata?: Record<string, string>;
	}) => Promise<Customer | undefined>;
	updateCustomer: (
		customerId: string,
		updates: Record<string, unknown>,
	) => Promise<Customer | undefined>;
	deleteCustomer: (customerId: string) => Promise<void>;
	setFilters: Setter<CustomerFilters>;
	clearError: () => void;
	selectCustomer: (customer: Customer | null) => void;
};

export function useCustomer(): UseCustomerReturn {
	// State
	const [customers, setCustomers] = createSignal<readonly Customer[]>([]);
	const [selectedCustomer, setSelectedCustomer] = createSignal<Customer | null>(
		null,
	);
	const [isLoading, setIsLoading] = createSignal(false);
	const [error, setError] = createSignal<string | null>(null);
	const [filters, setFilters] = createSignal<CustomerFilters>({});

	// Derived state
	const hasCustomers = createMemo(() => customers().length > 0);
	const customerCount = createMemo(() => customers().length);
	const hasError = createMemo(() => error() !== null);

	// Actions
	const fetchCustomers = async (newFilters?: CustomerFilters) => {
		try {
			setIsLoading(true);
			setError(null);

			if (newFilters) {
				setFilters(newFilters);
			}

			const result = await customerAdapter.getCustomers(filters());

			if (!result.success) {
				setError(result.error.message);
				return;
			}

			setCustomers(result.data);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchCustomer = async (customerId: string) => {
		try {
			setIsLoading(true);
			setError(null);

			const result = await customerAdapter.getCustomer(customerId);

			if (!result.success) {
				setError(result.error.message);
				return;
			}

			setSelectedCustomer(result.data);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	const createCustomer = async (data: {
		email: string;
		name?: string;
		phone?: string;
		description?: string;
		metadata?: Record<string, string>;
	}) => {
		try {
			setIsLoading(true);
			setError(null);

			const result = await customerAdapter.createCustomer(data);

			if (!result.success) {
				setError(result.error.message);
				return;
			}

			// Refresh customers list
			await fetchCustomers();
			return result.data;
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setIsLoading(false);
		}
		return undefined;
	};

	const updateCustomer = async (
		customerId: string,
		updates: Record<string, unknown>,
	) => {
		try {
			setIsLoading(true);
			setError(null);

			const result = await customerAdapter.updateCustomer(customerId, updates);

			if (!result.success) {
				setError(result.error.message);
				return;
			}

			// Update selected customer if it's the one being updated
			if (selectedCustomer()?.id === customerId) {
				setSelectedCustomer(result.data);
			}

			// Refresh customers list
			await fetchCustomers();
			return result.data;
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setIsLoading(false);
		}
		return undefined;
	};

	const deleteCustomer = async (customerId: string) => {
		try {
			setIsLoading(true);
			setError(null);

			const result = await customerAdapter.deleteCustomer(customerId);

			if (!result.success) {
				setError(result.error.message);
				return;
			}

			// Clear selected customer if it's the one being deleted
			if (selectedCustomer()?.id === customerId) {
				setSelectedCustomer(null);
			}

			// Refresh customers list
			await fetchCustomers();
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	const clearError = () => {
		setError(null);
	};

	const selectCustomer = (customer: Customer | null) => {
		setSelectedCustomer(customer);
	};

	return {
		// State
		customers,
		selectedCustomer,
		isLoading,
		error,
		filters,
		// Derived state
		hasCustomers,
		customerCount,
		hasError,
		// Actions
		fetchCustomers,
		fetchCustomer,
		createCustomer,
		updateCustomer,
		deleteCustomer,
		setFilters,
		clearError,
		selectCustomer,
	};
}
